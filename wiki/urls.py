from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^organism/\d+/$', views.index, name='main'),
    url(r'^organism/\d+/gene/\d+/$', views.index, name='main'),
    url(r'^organism/\d+/wd_go_edit', views.go_form, name='goForm'),
]
