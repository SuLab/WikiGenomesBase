'use strict';

angular.module('cmod', [
    //external
    'ui.bootstrap',
    'ngResource',
    'ngRoute',
    'ngTable',

    //internal
    'filters',
    'mainPage',
    'geneForm',
    'organismForm',
    'resources',
    'geneView',
    'organismView',
    'jbrowseView',
    'annotationsView',
    'landingPage',
    'geneOntology',
    'interPro',
    'operonAnnotations'
]);