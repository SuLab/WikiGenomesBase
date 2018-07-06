angular
    .module('organismView')
    .component('organismView', {
        templateUrl: '/static/build/js/angular_templates/organism-view.min.html',
        controller: function ($routeParams) {
            'use strict';
            var ctrl = this;
            ctrl.currentTaxid = $routeParams.taxid;
        },
        bindings: {
            org: '<'
        }
    });