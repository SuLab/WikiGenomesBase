angular
    .module('geneOverview')
    .component('geneOverview', {
        templateUrl: '/static/build/js/angular_templates/gene-overview.min.html',
        bindings: {
            data: '<',
            annotations: '<'
        },
        controller: function ($routeParams) {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function () {
            	ctrl.taxid = $routeParams.taxid;
            	
            };
            
            ctrl.$onChanges = function() {
            	console.log(ctrl.annotations);
            };
        }
    });
