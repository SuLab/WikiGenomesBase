angular
    .module('geneOverview')
    .component('geneOverview', {
        templateUrl: '/static/build/js/angular_templates/gene-overview.min.html',
        bindings: {
            data: '<',
            annotations: '<'
        },
        controller: function ($routeParams, sendToView, $location) {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function () {
            	ctrl.taxid = $routeParams.taxid;
            	ctrl.cm = ctrl.tm = ctrl.rm = ctrl.im = 0;
            };
            
            var url_surf = $location.path() + '/mg_mutant_view';
            
		   	sendToView.sendToView(url_surf, {"action" : "chemical"}).then(function(data) {
		        ctrl.cm = data.data.mutants.length;
		    });
		   	sendToView.sendToView(url_surf, {"action" : "transposition"}).then(function(data) {
	        	ctrl.tm = data.data.mutants.length;
		   	});
		   	sendToView.sendToView(url_surf, {"action" : "recombination"}).then(function(data) {
	        	ctrl.rm = data.data.mutants.length;
		   	});
		   	sendToView.sendToView(url_surf, {"action" : "insertion"}).then(function(data) {
	        	ctrl.im = data.data.mutants.length;
		   	});
        }
    });
