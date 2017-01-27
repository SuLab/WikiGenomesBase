from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
import json


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

