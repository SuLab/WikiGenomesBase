from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from scripts.WD_Utils import WDSparqlQueries as WDO
import json
from mwoauth import ConsumerToken, Handshaker
from wikigenomes import oauth_config, credentials_secret
from pprint import pprint
from wikidataintegrator import wdi_core, wdi_login
from time import strftime, gmtime
import requests

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
        goProp = {
                "Q14860489": "P680",
                "Q5058355": "P681",
                "Q2996394": "P682"
            }
        pprint(body)
        eutilsPMID = body['pub']['uid']
        refs = []
        try:
            refs.append(wdi_core.WDItemID(value='Q26489220', prop_nr='P1640', is_reference=True))
            refs.append(wdi_core.WDTime(str(strftime("+%Y-%m-%dT00:00:00Z", gmtime())), prop_nr='P813', is_reference=True))
            PMID_QID = WDO(prop='P698', string=eutilsPMID).wd_prop2qid()
            if PMID_QID != 'None':
                ifPub = WDO(prop='P31', qid=PMID_QID)
                if ifPub == 'Q13442814':
                    refs.append(wdi_core.WDItemID(value=PMID_QID, prop_nr='P248', is_reference=True))
            else:
                # use Greg's PMID Tool to create a pubmed citation in wikidata for this pmid
                pmid_url = 'https://tools.wmflabs.org/pmidtool/get_or_create/{}'.format(eutilsPMID)
                pmid_result =requests.get(url=pmid_url)
                if pmid_result.json()['success'] == True:
                    refs.append(wdi_core.WDItemID(value=pmid_result.json()['result'], prop_nr='P248', is_reference=True))
            responseData['ref_success'] = True
        except Exception as e:
            responseData['ref_success'] = False
            print("reference construction error: " + str(e))




        return JsonResponse(responseData)


@ensure_csrf_cookie
def wd_oauth(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        consumer_token = ConsumerToken(oauth_config.consumer_key, oauth_config.consumer_secret)
        mw_uri = "https://www.mediawiki.org/w/index.php"
        callbackURI = "http://54.166.140.4" + body['current_path'] + '/authorized'
        handshaker = Handshaker(mw_uri=mw_uri, consumer_token=consumer_token, callback=callbackURI)
        mw_redirect, request_token = handshaker.initiate(callback=callbackURI)
        response_data = {
            'wikimediaURL': mw_redirect
        }
        return JsonResponse(response_data)


@ensure_csrf_cookie
def oauth_response(request):
    context = {'data': 'None'}
    return render(request, "wiki/index.html", context=context)





