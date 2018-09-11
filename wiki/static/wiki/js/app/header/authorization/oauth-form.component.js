angular
    .module('oauthForm')
    .component('oauthForm', {
        controller: function ($window, $routeParams, $location, sendToView, appData) {
            'use strict';
            var ctrl = this;
            
            ctrl.authorization = $location.path().includes('authorized');

            appData.getAppData(function (data) {
                ctrl.appData = data;
            });
            
            ctrl.oauthAuthorization = function () {
                sendToView.sendToView(
                    '/wd_oauth',
                    {
                        'authorization': 'sending',
                        'current_path': $location.absUrl(),
                        'initiate': true
                    })
                    .then(function (data) {
                        $window.location.href = data.data.wikimediaURL;
                    });
            };

            ctrl.revokeAuthorization = function () {
                sendToView.sendToView(
                    '/wd_oauth',
                    {
                        'deauthenticate': true
                    })
                    .then(function (data) {
                        var org = '/organism/{taxid}'.replace('{taxid}', $routeParams.taxid);
                        var locusTag = '/gene/{locusTag}/'.replace('{locusTag}', $routeParams.locusTag);
                        $location.url(org + locusTag);
                    });

            };

        },
        templateUrl: '/static/build/js/angular_templates/oauth-form.min.html'
    });

