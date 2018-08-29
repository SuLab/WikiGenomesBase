angular.module('cmod')
    .config(
    function ($locationProvider,
              $routeProvider,
              $httpProvider,
              $interpolateProvider,
              $compileProvider) {
        
        'use strict';

        $locationProvider.html5Mode({
            enabled: true
        });


        $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);

        $routeProvider.
            when("/", {
                template: '<landing-page></landing-page>'
            }).
            when("/organism/:taxid/", {
                template: '<browser-page></browser-page>'
            }).
            when("/keyword/:keyword", {
                template: '<adv-search-page></adv-search-page>'
            }).
            when("/keyword/", {
                template: '<adv-search-page></adv-search-page>'
            }).
            when("/organism/:taxid/gene/:locusTag", {
                template: '<main-page></main-page>'
            }).
            when("/organism/:taxid/gene/:locusTag/authorized/", {
                template: '<main-page></main-page>'
            }).
            otherwise({
                template: "<not-found></not-found>"
            });

        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    }).
    run([
        '$http',
        '$cookies',
        function ($http, $cookies) {
            $http.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken');
        }]);


