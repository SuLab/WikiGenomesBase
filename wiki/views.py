from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.mail import send_mail

import requests
from time import strftime, gmtime
from pprint import pprint

import json
import jsonpickle

from scripts.mutant_annotations import  MutantMongo
from scripts.jbrowse_configuration import FeatureDataRetrieval
from scripts.get_mongo_annotations import GetMongoAnnotations
from scripts.WD_Utils import WDSparqlQueries

from wikigenomes_conf import consumer_key, consumer_secret
from wikidataintegrator import wdi_login, wdi_core


def index(request):
    # launch landing page
    context = {'data': 'None'}
    return render(request, "wiki/index.html", context=context)

def email(request):
  subject = request.GET['subject']
  body = request.GET['body']
  send_mail(subject, body, "help@chlambase.org", ['help@chlambase.org'])
  return JsonResponse({})

def align(request):
  content = {
    "email": "help@chlambase.org",
    "title": "ortholog alignment",
    "format": "fasta",
    "tree": "tree1",
    "order": "aligned",
    "sequence": request.GET['sequence']
  }
  if int(request.GET['length']) > 1:
    r = requests.post("http://www.ebi.ac.uk/Tools/services/rest/muscle/run/", data=content)
    return JsonResponse({"id":r.text})
  else:
    return JsonResponse({"message": "Need more than 1 sequence"}, status=415)

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
        
        if 'login' not in request.session.keys():
            responseData['authentication'] = False
            return JsonResponse(responseData)
        else:
            responseData['authentication'] = True
        
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
def hostpath_form(request):
    """
    uses wdi to make go annotation edit to wikidata
    :param request: includes go annotation json for writing to wikidata
    :return: response data object with a write success boolean
    """
    print("Host Path Form")
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        responseData = {}
        if 'login' not in request.session.keys():
            responseData['authentication'] = False
            return JsonResponse(responseData)
        else:
            responseData['authentication'] = True

        login = jsonpickle.decode(request.session['login'])
        eutilsPMID = body['pub']['uid']
        refs = []
        # #
        # # contstruct the references using WDI_core and PMID_tools if necessary
        print("Constructing reference")
        try:
            refs.append(wdi_core.WDItemID(value='Q26489220', prop_nr='P1640', is_reference=True))
            refs.append(wdi_core.WDTime(str(strftime("+%Y-%m-%dT00:00:00Z", gmtime())), prop_nr='P813',
                                        is_reference=True))
            pmid_url = 'https://tools.wmflabs.org/pmidtool/get_or_create/{}'.format(eutilsPMID)
            pmid_result = requests.get(url=pmid_url)

            if pmid_result.json()['success'] == True:
                refs.append(wdi_core.WDItemID(value=pmid_result.json()['result'], prop_nr='P248', is_reference=True))
                
            print("PMID Json Result:")
            print(pmid_result.json())
            responseData['ref_success'] = True
        except Exception as e:
            responseData['ref_success'] = False
            print("reference construction error: " + str(e))

        statements = []
        # #contstruct the statements using WDI_core
        print("Constructing statements")
        try:
            eviCodeQID = body['determination']['item'].split("/")[-1]
            hostProtein = body['host_protein']['protein']['value'].split("/")[-1]
            evidence = wdi_core.WDItemID(value=eviCodeQID, prop_nr='P459', is_qualifier=True)
            statements.append(wdi_core.WDItemID(value=hostProtein, prop_nr='P129', references=[refs],
                                                qualifiers=[evidence]))
            responseData['statement_success'] = True
        except Exception as e:
            responseData['statement_success'] = False
            print(e)

        #write the statement to WD using WDI_core
        print("Writing the statement")
        try:
            print("protein id:")
            print(body['proteinQID'])
            
            # find the appropriate item in wd
            wd_item_protein = wdi_core.WDItemEngine(wd_item_id=body['proteinQID'], domain=None,
                                                    data=statements, use_sparql=True,
                                                    append_value='P129')
            print("Writing protein with login")
            wd_item_protein.write(login=login)
            responseData['write_success'] = True

        except Exception as e:
            responseData['write_success'] = False
            print(e)
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
        responseData = {}
        if 'login' not in request.session.keys():
            responseData['authentication'] = False
            return JsonResponse(responseData)

        login = jsonpickle.decode(request.session['login'])
        # statements for operon item
        operon_statements = []
        # references
        refs = []
        for publication in body['pub']:
            eutilsPMID = publication['uid']
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
        print(refs)

        #
        # # create new operon item statements
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
        
        responseData = {}
        if 'login' not in request.session.keys():
            responseData['authentication'] = False
            return JsonResponse(responseData)
        
        if body['action'] == 'annotate':
            del body['action']
            try:
                annotation = MutantMongo(mut_json=body)
                body['write_success'] = annotation.push2mongo()['write_success']
            except Exception as e:
                body['write_success'] = False

        if 'action' in body.keys() and body['action'] == 'delete':
            try:
                annotation = MutantMongo(mut_json=body)
                body['delete_success'] = annotation.delete_one_mongo()['delete_success']
            except Exception as e:
                body['delete_success'] = False
        return JsonResponse(body)
    else:
        return JsonResponse({"error": "only accept POST requests"})


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
            callbackURI = 'https://chlambase.org{}/authorized/'.format(body['current_path'])
            authentication = wdi_login.WDLogin(consumer_key=consumer_key,
                                               consumer_secret=consumer_secret,
                                               callback_url=callbackURI)
            request.session['authOBJ'] = jsonpickle.encode(authentication)
            response_data = {
                'wikimediaURL': authentication.redirect
            }
            return JsonResponse(response_data)

        # parse the url from wikidata for the oauth token and secret
        if 'url' in body.keys():
            authentication = jsonpickle.decode(request.session['authOBJ'])
            authentication.continue_oauth(oauth_callback_data=body['url'].encode("utf-8"))
            request.session['login'] = jsonpickle.encode(authentication)
            return JsonResponse(body)

        # clear the authenitcation if user wants to revoke
        if 'deauthenticate' in body.keys():
            if 'authentication' in request.session.keys():
                 del request.session['authentication']
            if 'login' in request.session.keys():
                 del request.session['login']
            if 'authOBJ' in request.session.keys():
                 del request.session['authOBJ']
            return JsonResponse({'deauthenicate': True})


@ensure_csrf_cookie
def mongo_annotations(request):
    """
    :param request:
    :return:
    """

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        annotations = GetMongoAnnotations()
        annotation_data = {
            'mutants': []
        }
        mg_mutants = annotations.get_mutants(locus_tag=body['locusTag'])

        for mut in mg_mutants:
            annotation_data['mutants'].append(mut)
                
        return JsonResponse(annotation_data, safe=False)
        
@ensure_csrf_cookie
def validate_session(request):
     validated = 'authOBJ' in request.session.keys() or 'login' in request.session.keys()
     return JsonResponse({'login': validated})

@ensure_csrf_cookie
def geneName_form(request):
    """
    uses wdi to make go annotation edit to wikidata
    :param request: includes go annotation json for writing to wikidata
    :return: response data object with a write success boolean
    """
    print("Gene Name Form")
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        
        responseData = {}
        if 'login' not in request.session.keys():
            responseData['authentication'] = False
            return JsonResponse(responseData)
        else:
            responseData['authentication'] = True

        login = jsonpickle.decode(request.session['login'])

        #write the name to the gene and protein
        try:
        
            print("Writing to gene " + body['geneQID'])
            if body['geneQID'] != "":
                wd_item_gene = wdi_core.WDItemEngine(wd_item_id=body['geneQID'], domain=None)
                wd_item_gene.set_label(body['geneName'])
                wd_item_gene.write(login=login)        
            
            print("Writing to protein " + body['proteinQID'])
            if body['proteinQID'] != "":
                body['geneName'] = body['geneName'][0:1].upper() + body['geneName'][1:]
                wd_item_protein = wdi_core.WDItemEngine(wd_item_id=body['proteinQID'], domain=None)
                wd_item_protein.set_label(body['geneName'])
                wd_item_protein.write(login=login)
                
            responseData['write_success'] = True

        except Exception as e:
            responseData['write_success'] = False
            print(e)
        return JsonResponse(responseData)
