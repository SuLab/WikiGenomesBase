from django.shortcuts import render


def index(request):
    # launch landing page
    return render(request, "wiki/index.html", context={"data": "None"})