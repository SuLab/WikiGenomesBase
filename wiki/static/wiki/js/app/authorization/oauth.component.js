angular
    .module('oauthView')
    .component('oauthView', {
        bindings: {},
        controller: function ($window, oauthSubmission, $location) {
            var ctrl = this;
            if ($location.path().includes('authorized')){
                ctrl.authorization_button = 'Revoke authorization';
                ctrl.auth_class = 'btn btn-warning'
            }else{
                ctrl.authorization_button = 'Authorize to edit';
                ctrl.auth_class = 'btn btn-success'
            }

            ctrl.oauthAuthorization = function () {
                oauthSubmission.submitOauth(
                    '/wd_oauth',
                    {
                        'authorization': 'sending',
                        'current_path': $location.path()
                    })
                    .then(function (data) {
                        console.log(data);
                        $window.location.href = data.data.wikimediaURL;
                    });
            };
        },
        template: '<div ng-click="$ctrl.oauthAuthorization()" ng-class="$ctrl.auth_class">{{$ctrl.authorization_button}}</div>'
    });

