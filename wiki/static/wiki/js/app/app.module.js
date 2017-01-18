'use strict';

angular.module('cmod', [
    //external
    'ui.bootstrap',
    'ngResource',
    'ngRoute',

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
    'landingPage'
]);