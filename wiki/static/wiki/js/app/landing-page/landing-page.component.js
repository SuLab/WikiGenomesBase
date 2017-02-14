angular
    .module('landingPage')
    .component('landingPage', {
        controller: function (allChlamOrgs) {
            var ctrl = this;
            ctrl.orgList = allChlamOrgs.getAllOrgs();
        },
        templateUrl: '/static/wiki/js/angular_templates/landing-page.html'
    });


