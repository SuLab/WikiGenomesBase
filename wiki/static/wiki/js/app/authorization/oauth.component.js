angular
    .module('oauthView')
    .component('oauthView', {
        bindings: {},
        controller: function (oauthSubmission) {
            var ctrl = this;
            ctrl.oauthAuthorization = function () {
                    oauthSubmission.submitOauth('/wd_oauth', {'authorize': 'True'})
                        .then(function (data) {
                        console.log(data);
                               //window.location.replace(data);
                    });
            };
        },
        template: '<div ng-click="$ctrl.oauthAuthorization()" class="btn btn-default">Authorize to edit</div>'
    });


