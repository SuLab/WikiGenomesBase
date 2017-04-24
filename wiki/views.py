from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from wikigenomes import oauth_config
from pprint import pprint
from wikidataintegrator import wdi_login, wdi_core
from time import strftime, gmtime
import requests
from pprint import pprint
import jsonpickle
from django.middleware.csrf import get_token


def index(request):
    # launch landing page
    context = {'data': 'None'}
    return render(request, "wiki/index.html", context=context)


@ensure_csrf_cookie
def go_form(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        responseData = {}
        login = jsonpickle.decode(request.session['login'])
        pprint(login)
        goclass = body['goClass']
        goProp = {
                "Q14860489": "P680",
                "Q5058355": "P681",
                "Q2996394": "P682"
            }
        eutilsPMID = body['pub']['uid']
        refs = []

        # contstruct the references using WDI_core and PMID_tools if necessary
        try:
            refs.append(wdi_core.WDItemID(value='Q26489220', prop_nr='P1640', is_reference=True))
            refs.append(wdi_core.WDTime(str(strftime("+%Y-%m-%dT00:00:00Z", gmtime())), prop_nr='P813', is_reference=True))
            pmid_url = 'https://tools.wmflabs.org/pmidtool/get_or_create/{}'.format(eutilsPMID)
            pmid_result = requests.get(url=pmid_url)
            if pmid_result.json()['success'] == True:
                refs.append(wdi_core.WDItemID(value=pmid_result.json()['result'], prop_nr='P248', is_reference=True))
            pprint(pmid_result.json())
            responseData['ref_success'] = True
        except Exception as e:
            responseData['ref_success'] = False
            print("reference construction error: " + str(e))

        statements = []
        #contstruct the statements using WDI_core
        try:
            eviCodeQID = body['evi']['evidence_code'].split("/")[-1]
            goQID = body['go']['goterm']['value'].split("/")[-1]
            evidence = wdi_core.WDItemID(value=eviCodeQID, prop_nr='P459', is_qualifier=True)
            statements.append(wdi_core.WDItemID(value=goQID, prop_nr=goProp[goclass], references=[refs], qualifiers=[evidence]))
            responseData['statement_success'] = True
        except Exception as e:
            responseData['statement_success'] = False
            print(e)

        # write the statement to WD using WDI_core
        try:
            # find the appropriate item in wd
            wd_item_protein = wdi_core.WDItemEngine(wd_item_id=body['proteinQID'], domain=None,
                                                    data=statements, use_sparql=True,
                                                    append_value=[goProp[goclass]])
            wd_item_protein.write(login=login)
            responseData['write_success'] = True

        except Exception as e:
            responseData['write_success'] = False
            print(e)
        pprint(responseData)
        return JsonResponse(responseData)


@ensure_csrf_cookie
def operon_form(request):
    if request.method == 'POST':
        print('operon form initiated')
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        pprint(body)
        responseData = {}

        login = jsonpickle.decode(request.session['login'])

        eutilsPMID = body['pub']['uid']
        refs = []
        pprint(body)

        # statements for operon item
        operon_statements = []

        # contstruct the references using WDI_core and PMID_tools if necessary
        try:
            refs.append(wdi_core.WDItemID(value='Q26489220', prop_nr='P1640', is_reference=True))
            refs.append(wdi_core.WDTime(str(strftime("+%Y-%m-%dT00:00:00Z", gmtime())), prop_nr='P813', is_reference=True))
            pmid_url = 'https://tools.wmflabs.org/pmidtool/get_or_create/{}'.format(eutilsPMID)
            pmid_result = requests.get(url=pmid_url)
            if pmid_result.json()['success'] == True:
                refs.append(wdi_core.WDItemID(value=pmid_result.json()['result'], prop_nr='P248', is_reference=True))
            else:
                return JsonResponse({'pmid': False})
            pprint(pmid_result.json())
            responseData['ref_success'] = True
        except Exception as e:
            responseData['ref_success'] = False
            print("reference construction error: " + str(e))

        # create new operon item statements
        try:
            operon_statements.append(wdi_core.WDItemID(prop_nr='P279', value='Q139677', references=[refs]))
            for gene in body['genes']:
                qid = gene['gene'].split('/')[-1]
                operon_statements.append(wdi_core.WDItemID(prop_nr='P527', value=qid, references=[refs]))

            responseData['operon_success'] = True
        except Exception as e:
            pprint(e)
            responseData['operon_success'] = False
        pprint(responseData)

        # write the operon Item
        operon_qid = None
        try:
            pprint(body['operon']['operonLabel'])
            pprint(operon_statements)
            wd_item_operon = wdi_core.WDItemEngine(item_name=body['operon']['operonLabel']['value'], domain='genes', data=operon_statements, use_sparql=True, append_value=['P527'])
            pprint(vars(wd_item_operon))
            wd_item_operon.set_label(body['operon']['operonLabel']['value'])
            wd_item_operon.set_description("Microbial operon found in " + body['organism']['taxonLabel'])
            pprint(wd_item_operon.get_wd_json_representation())
            wd_item_operon.write(login=login)
            operon_qid = wd_item_operon.wd_item_id
            responseData['operonWrite_success'] = True
        except Exception as e:
            print(e)
            responseData['operonWrite_success'] = False

        gene_statement = [wdi_core.WDItemID(prop_nr='P361', value=operon_qid, references=[refs])]

        for gene in body['genes']:
            try:
                qid = gene['gene'].split('/')[-1]
                wd_gene_item = wdi_core.WDItemEngine(wd_item_id=qid, data=gene_statement, use_sparql=True)
                wd_gene_item.write(login=login)
                responseData['gene_write_success'] = True
            except Exception as e:
                pprint(e)
                responseData['gene_write_success'] = False

        pprint(responseData)
        return JsonResponse(responseData)


@ensure_csrf_cookie
def wd_oauth(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        pprint(body)
        if 'initiate' in body.keys():
            print(body)
            callbackURI = "http://chlambase.org" + body['current_path'] + '/authorized/'
            authentication = wdi_login.WDLogin(consumer_key=oauth_config.consumer_key,
                                               consumer_secret=oauth_config.consumer_secret,
                                               callback_url=callbackURI)
            request.session['authOBJ'] = jsonpickle.encode(authentication)
            response_data = {
                'wikimediaURL': authentication.redirect
            }
            return JsonResponse(response_data)
        if 'url' in body.keys():
            authentication = jsonpickle.decode(request.session['authOBJ'])
            authentication.continue_oauth(oauth_callback_data=body['url'])
            request.session['login'] = jsonpickle.encode(authentication)
            return JsonResponse(body)
        if 'deauthenticate' in body.keys():
            request.session['authentication'] = None
            request.session['login'] = None
            return JsonResponse({'deauthenicate': True})


@ensure_csrf_cookie
def wd_upload(request):
    print(request.body)
    # print('request made')
    # if request.method == 'POST':
    #     print(request.body)
    return JsonResponse({'success': 'yes'})






