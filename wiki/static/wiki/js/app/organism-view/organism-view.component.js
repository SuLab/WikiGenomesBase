angular
    .module('organismView')
    .component('organismView', {
        templateUrl: '/static/build/js/angular_templates/organism-view.min.html',
        controller: function ($routeParams, taxidFilter) {
            'use strict';
            var ctrl = this;
            ctrl.currentTaxid = $routeParams.taxid;

            taxidFilter.name(ctrl.currentTaxid).then(function(data) {
                ctrl.name = data;
            });
        }
    });