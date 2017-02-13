from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import Http404
import json
from mwoauth import ConsumerToken, RequestToken, initiate, complete, identify
from wikigenomes import oauth_config


def index(request):
    # launch landing page
    return render(request, "wiki/index.html", context={"data": "None"})


@ensure_csrf_cookie
def go_form(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        print(body['go'])
        return JsonResponse({'goForm': 'test'})

@ensure_csrf_cookie
def wd_oauth(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        request.session['oauth'] = json.loads(body_unicode)
        consumer_token = ConsumerToken(oauth_config.consumer_key, oauth_config.consumer_secret)
        request.session['consumer_token'] = {'key': consumer_token.key, 'secret': consumer_token.secret}
        mw_uri = "https://www.mediawiki.org/w/index.php"
        mw_redirect, request_token = initiate(mw_uri, consumer_token)
        request.session['request_token'] = {'key': request_token.key.decode(), 'secret': request_token.secret.decode()}
        return JsonResponse({"wikimediaURL": mw_redirect})


