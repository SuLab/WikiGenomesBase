angular
    .module('oauthView')
    .component('oauthView', {
        bindings: {},
        controller: function ($window, $routeParams, $location, sendToView) {
            'use strict';
            var ctrl = this;
            if ($routeParams.oauth_verifier) {
                sendToView.sendToView(
                    '/wd_oauth',
                    {'url': $location.url()}
                )
                    .then(
                    function (data) {
                        console.log(data);
                    });


                $location.url($location.path());
            }
            
            ctrl.authorization = $location.path().includes('authorized');

        },
        templateUrl: '/static/build/js/angular_templates/authorization-view.min.html'
    });

