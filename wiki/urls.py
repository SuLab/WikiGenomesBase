from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^keyword/..', views.index, name='index'),
    url(r'^organism/\d+/$', views.index, name='main'),
    url(r'^organism/\d+/gene/\d+/$', views.index, name='main'),
    url(r'^organism/\d+/gene/\d+/wd_go_edit', views.go_form, name='goForm'),
    url(r'^wd_oauth', views.wd_oauth, name='wd_oauth'),
    url(r'^organism/\d+/gene/\d+/authorized', views.oauth_response, name='wd_oauth')

]
