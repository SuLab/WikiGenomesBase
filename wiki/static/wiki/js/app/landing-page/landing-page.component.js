angular
    .module('landingPage')
    .component('landingPage', {
        controller: function (allOrgs) {
            var ctrl = this;
            ctrl.orgList = allOrgs.getAllOrgs();
        },
        templateUrl: '/static/wiki/js/angular_templates/landing-page.html'
    });


