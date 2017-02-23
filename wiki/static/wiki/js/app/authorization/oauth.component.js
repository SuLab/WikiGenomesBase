angular
    .module('oauthView')
    .component('oauthView', {
        bindings: {},
        controller: function ($window, oauthSubmission, $location) {
            var ctrl = this;
            if ($location.path().includes('authorized')){
                ctrl.authorization_button = 'Authorized';
            }else{
                ctrl.authorization_button = 'Authorize to edit';
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
        template: '<div ng-click="$ctrl.oauthAuthorization()" class="btn btn-success">{{$ctrl.authorization_button}}</div>'
    });

