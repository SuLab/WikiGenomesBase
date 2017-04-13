from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from scripts.WD_Utils import WDSparqlQueries as WDO
import json
from mwoauth import ConsumerToken, Handshaker
from wikigenomes import oauth_config, credentials_secret
from pprint import pprint

from scripts.WikidataIntegrator.wikidataintegrator import wdi_login, wdi_core
from time import strftime, gmtime
import requests
import webbrowser


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
        login = wdi_login.WDLogin(user=credentials_secret.user, pwd=credentials_secret.pwd)
        goclass = body['goClass']
        goProp = {
                "Q14860489": "P680",
                "Q5058355": "P681",
                "Q2996394": "P682"
            }
        eutilsPMID = body['pub']['uid']
        refs = []
        #contstruct the references using WDI_core and PMID_tools if necessary
        try:
            refs.append([wdi_core.WDItemID(value='Q26489220', prop_nr='P1640', is_reference=True)])
            refs.append([wdi_core.WDTime(str(strftime("+%Y-%m-%dT00:00:00Z", gmtime())), prop_nr='P813', is_reference=True)])
            pmid_url = 'https://tools.wmflabs.org/pmidtool/get_or_create/{}'.format(eutilsPMID)
            pmid_result = requests.get(url=pmid_url)
            if pmid_result.json()['success'] == True:
                refs.append([wdi_core.WDItemID(value=pmid_result.json()['result'], prop_nr='P248', is_reference=True)])
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
            statements.append(wdi_core.WDItemID(value=goQID, prop_nr=goProp[goclass], references=refs, qualifiers=[evidence]))
            responseData['statement_success'] = True
        except Exception as e:
            responseData['statement_success'] = False
            print(e)

        #write the statement to WD using WDI_core
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
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        return JsonResponse({"write_success": True})


@ensure_csrf_cookie
def wd_oauth(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        callbackURI = "http://chlambase.org" + body['current_path'] + '/authorized/'
        authentication = wdi_login.WDLogin(consumer_key=oauth_config.consumer_key,
                                           consumer_secret=oauth_config.consumer_secret,
                                           callback_url=callbackURI)
        response_data = {
            'wikimediaURL': authentication.redirect
        }
        return JsonResponse(response_data)

@ensure_csrf_cookie
def oauth_response(request):
    context = {'data': 'None'}
    return render(request, "wiki/index.html", context=context)






