angular
    .module('organismView')
    .component('organismView', {
        templateUrl: '/static/wiki/js/angular_templates/organism-view.html',
        controller: function ($routeParams) {
            var ctrl = this;
            ctrl.currentTaxid = $routeParams.taxid;
        },
        bindings: {
            org: '<'
        }
    });