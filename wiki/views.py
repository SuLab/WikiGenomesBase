from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import Http404
import json
from mwoauth import ConsumerToken, Handshaker
from wikigenomes import oauth_config


def index(request):
    # launch landing page
    context = {'data': 'None'}
    return render(request, "wiki/index.html", context=context)


@ensure_csrf_cookie
def go_form(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        return JsonResponse({'goForm': 'test'})


@ensure_csrf_cookie
def wd_oauth(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        consumer_token = ConsumerToken(oauth_config.consumer_key, oauth_config.consumer_secret)
        print(consumer_token)
        mw_uri = "https://www.mediawiki.org/w/index.php"
        callbackURI = "http://54.166.140.4" + body['current_path'] + '/authorized'
        print(callbackURI)
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
