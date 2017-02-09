'use strict';

angular.module('cmod', [
    //external
    'ui.bootstrap',
    'ngResource',
    'ngRoute',
    'ngTable',

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
    'genomicPosition',
    'enzymeView',
    'geneDownload',
    'angularUtils.directives.dirPagination',
    'notFound'
]);