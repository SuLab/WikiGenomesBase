from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^keyword/.*', views.index, name='index'),
    url(r'^upload-full-form/$', views.index, name='index'),
    url(r'^organism/\d+/$', views.index, name='main'),
    url(r'^organism/\d+/gene/.+/$', views.index, name='main'),
    url(r'^organism/\d+/gene/.+/wd_go_edit', views.go_form, name='goForm'),
    url(r'^organism/\d+/gene/.+/wd_hostpath_edit', views.hostpath_form, name='hostpathForm'),
	url(r'^organism/\d+/gene/.+/wd_localization_edit', views.localization_form, name='localizationForm'),
    url(r'^organism/\d+/gene/.+/wd_operon_edit', views.operon_form, name='operonForm'),
    url(r'^organism/\d+/gene/.+/wd_mutant_edit', views.mutant_form, name='mutantForm'),
	url(r'^organism/\d+/gene/.+/wd_gene_name_edit', views.geneName_form, name='geneNameForm'),
    url(r'^organism/\d+/gene/.+/mg_mutant_view', views.mongo_annotations, name='mongoAnnotations'),
    url(r'^wd_oauth', views.wd_oauth, name='wd_oauth'),
    url(r'^email', views.email, name='helpForm'),
    url(r'^alignOrthologs', views.align, name='orthologAlignment'),
	url(r'^validateSession', views.validate_session, name='validateSession'),
]
