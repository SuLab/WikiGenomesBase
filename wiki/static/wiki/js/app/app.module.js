'use strict';

angular.module('cmod', [
    //external
    'ui.bootstrap',
    'ngResource',
    'ngRoute',
    'ngTable',
    'ngFileUpload',
    'ngCookies',

    //internal
    'filters',
    'browserPage',
    'mainPage',
    'geneForm',
    'organismForm',
    'resources',
    'geneView',
    'proteinView',
    'organismView',
    'jbrowseView',
    'annotationsView',
    'landingPage',
    'geneOntology',
    'interPro',
    'operonAnnotations',
    'goForm',
    'operonForm',
    'genomicPosition',
    'enzymeView',
    'mutantsView',
    'allgenesDownload',
    'angularUtils.directives.dirPagination',
    'oauthView',
    'genesKeyword',
    'keywordForm',
    'keywordPaginated',
    'organismTree',
    'linkedPubs',
    'orthologView',
    'mutantForm',
    'functionalAnnotation'
]);