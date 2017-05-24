from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

import requests
from time import strftime, gmtime
from pprint import pprint

import json
import jsonpickle

from scripts.mutant_annotations import  MutantMongo
from scripts.jbrowse_configuration import FeatureDataRetrieval
from scripts.get_mongo_annotations import GetMongoAnnotations

from wikigenomes import oauth_config
from wikidataintegrator import wdi_login, wdi_core


def index(request):
    # launch landing page
    context = {'data': 'None'}
    return render(request, "wiki/index.html", context=context)


@ensure_csrf_cookie
def go_form(request):
    """
    uses wdi to make go annotation edit to wikidata
    :param request: includes go annotation json for writing to wikidata
    :return: response data oject with a write success boolean
    """
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
            refs.append(wdi_core.WDTime(str(strftime("+%Y-%m-%dT00:00:00Z", gmtime())), prop_nr='P813',
                                        is_reference=True))
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
            statements.append(wdi_core.WDItemID(value=goQID, prop_nr=goProp[goclass], references=[refs],
                                                qualifiers=[evidence]))
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
    """
    uses wdi to make operon annotation edit to wikidata
    :param request: includes operon annotation json for writing to wikidata
    :return: response data oject with a write success boolean
    """
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

        # construct the references using WDI_core and PMID_tools if necessary
        try:
            refs.append(wdi_core.WDItemID(value='Q26489220', prop_nr='P1640', is_reference=True))
            refs.append(wdi_core.WDTime(str(strftime("+%Y-%m-%dT00:00:00Z", gmtime())), prop_nr='P813',
                                        is_reference=True))
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
            wd_item_operon = wdi_core.WDItemEngine(item_name=body['operon']['operonLabel']['value'], domain='genes',
                                                   data=operon_statements, use_sparql=True, append_value=['P527'])
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
def mutant_form(request):
    """

    edit local mutant repository with user supplied annotation
    :param request:
    :return:
    """
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        annotation = MutantMongo(mut_json=body)
        if body['action'] == 'annotate':
            print('action annotate')
            annotation.add_gff_from_json()
            write_result = annotation.push2mongo()
            body['write_result'] = write_result
            print(write_result)
            if write_result['write_success'] is True:
                body['write_success'] = True
            else:
                body['write_success'] = False
            refObj = FeatureDataRetrieval(taxid=body['taxid'])
            refObj.mutants2gff()
        if body['action'] == 'delete':
            print('action delete')
            delete_result = annotation.delete_one_mongo()
            if delete_result['delete_success'] is True:
                body['delete_success'] = True
            else:
                body['delete_success'] = False

        return JsonResponse(body)


@ensure_csrf_cookie
def wd_oauth(request):
    """
    handles the authenitication process of wikimedia oauth1
    :param request:
    :return: access token for editing with wikidata api
    """
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        pprint(body)
        # initiate the handshake by sendin consumer token to wikidata by redirect
        if 'initiate' in body.keys():
            callbackURI = 'http://chlambase.org{}/authorized/'.format(body['current_path'])
            authentication = wdi_login.WDLogin(consumer_key=oauth_config.consumer_key,
                                               consumer_secret=oauth_config.consumer_secret,
                                               callback_url=callbackURI)
            request.session['authOBJ'] = jsonpickle.encode(authentication)
            response_data = {
                'wikimediaURL': authentication.redirect
            }
            return JsonResponse(response_data)

        # parse the url from wikidata for the oauth token and secret
        if 'url' in body.keys():
            authentication = jsonpickle.decode(request.session['authOBJ'])
            authentication.continue_oauth(oauth_callback_data=body['url'])
            request.session['login'] = jsonpickle.encode(authentication)
            return JsonResponse(body)

        # clear the authenitcation if user wants to revoke
        if 'deauthenticate' in body.keys():
            request.session['authentication'] = None
            request.session['login'] = None
            return JsonResponse({'deauthenicate': True})


@ensure_csrf_cookie
def mongo_annotations(request):
    """
    :param request:
    :return:
    """
    def removekey(d, key):
        r = dict(d)
        del r[key]
        return r

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        pprint(body)
        annotations = GetMongoAnnotations()
        annotation_data = {
            'mutants': [],
            'reactions': []
        }
        mg_mutants = annotations.get_mutants(locus_tag=body['locusTag'])

        for mut in mg_mutants:
            print(mut)
            annotation_data['mutants'].append(mut)
        ecs = [x for x in body['ec_number'] if '-' not in x]
        if len(ecs) > 0:
            for ec in ecs:
                reactions = annotations.get_reactions(ec_number=ec)
                for rxn in reactions:
                    rxn = removekey(rxn, '_id')
                    annotation_data['reactions'].append(rxn)
        print(annotation_data)
        return JsonResponse(annotation_data, safe=False)



