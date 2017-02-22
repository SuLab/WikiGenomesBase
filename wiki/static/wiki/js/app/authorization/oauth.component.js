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
                        //$window.location.href = data.data.wikimediaURL;
                    });
            };
        },
        template: '<div ng-click="$ctrl.oauthAuthorization()" class="btn btn-success">Authorize to edit</div>'
    });


var responseURL = '/organism/471472/gene/5858590?oauth_verifier=dc3b40e936b1b041d3a08eddf2e37c2d&oauth_token=5b42c3b6645eae4415a93211bb67a949';