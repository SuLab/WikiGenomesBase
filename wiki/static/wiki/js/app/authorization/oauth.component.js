angular
    .module('oauthView')
    .component('oauthView', {
        bindings: {},
        controller: function ($window, $routeParams, $location, oauthSubmission, sendToView) {
            var ctrl = this;
            console.log($routeParams);
            if ($routeParams.oauth_verifier) {
                console.log("routparams");
                sendToView.sendToView(
                    '/wd_oauth',
                    {'url': $location.url()}
                )
                    .then(
                    function(data){
                     console.log(data);
                    });


                $location.url($location.path());
            }
            if ($location.path().includes('authorized')) {
                ctrl.authorization = true;
            } else {
                ctrl.authorization = false;
            }

            ctrl.oauthAuthorization = function () {
                console.log($location.path());
                sendToView.sendToView(
                    '/wd_oauth',
                    {
                        'authorization': 'sending',
                        'current_path': $location.path(),
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
                        $window.location.href = data.data.wikimediaURL;
                    });
                var org = '/organism/{taxid}'.replace('{taxid}', $routeParams.taxid);
                console.log(org);
                var locusTag = '/gene/{locusTag}/'.replace('{locusTag}', $routeParams.locusTag);
                console.log(locusTag);
                $location.url(org + locusTag);
            };


        },
        templateUrl: '/static/wiki/js/angular_templates/authorization-view.html'
    });

