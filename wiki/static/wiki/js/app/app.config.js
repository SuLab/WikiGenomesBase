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
            when("/organism/:taxid", {
                template: '<main-page></main-page>'
            }).
            otherwise({
                template: "Not found"
            })

    });
