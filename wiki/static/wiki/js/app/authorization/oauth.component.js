angular
    .module('oauthView')
    .component('oauthView', {
        bindings: {},
        controller: function ($window, oauthSubmission, $location) {
            var ctrl = this;
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
        template: '<div ng-click="$ctrl.oauthAuthorization()" class="btn btn-success">Authorize to edit</div>'
    });

