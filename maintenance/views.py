from django.shortcuts import render

def index(request):
    # launch maitenance page
    return render(request, "index.html")