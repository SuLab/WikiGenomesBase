'use strict';

angular.module('cmod')
    .config(
    function ($locationProvider,
              $routeProvider) {
        $locationProvider.html5Mode({
            enabled: true
        });

        $routeProvider.
            when("/", {
                template: '<landing-page></landing-page>'
            }).
            when("/organism/:taxid/", {
                template: '<browser-page></browser-page>'
            }).
            when("/keyword/:keyword", {
                template: '<genes-keyword></genes-keyword>'
            }).
            when("/organism/:taxid/gene/:locusTag", {
                template: '<main-page></main-page>'
            }).
            when("/organism/:taxid/gene/:locusTag/authorized/", {
                template: '<main-page></main-page>'
            }).
            when("/upload-full-form/", {
                template: '<upload-form></upload-form>'
            }).
            otherwise({
                template: "<not-found></not-found>"
            })

    });
angular.module('cmod')
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }]);
