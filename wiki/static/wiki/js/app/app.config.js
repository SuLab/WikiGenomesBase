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
            when("/organism/:taxid/gene/:entrez", {
                template: '<main-page></main-page>'
            }).
            otherwise({
                template: "Not found"
            })

    });


angular.module('cmod')
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }]);
