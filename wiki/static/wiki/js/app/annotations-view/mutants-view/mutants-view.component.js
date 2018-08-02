angular
    .module('mutantsView')
    .component('mutantsView', {
        bindings : {
            data : '<'
        },
        controller : function($location, sendToView, NgTableParams, $filter) {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function() {};
            
            ctrl.authorized = $location.path().includes("authorized");
            
            ctrl.deleteAnnotation = function(mutant) {
                console.log(mutant);
                ctrl.loading = true;
                mutant.action = 'delete';
                var url_suf = $location.path() + '/wd_mutant_edit';
                sendToView.sendToView(url_suf, mutant).then(function(data) {}).finally(function() {
                    ctrl.loading = false;
                });
            };
            
            ctrl.chemParams = new NgTableParams({}, {});
            ctrl.transParams = new NgTableParams({}, {});
            ctrl.intronParams = new NgTableParams({}, {});
            ctrl.recombParams = new NgTableParams({}, {});
            
            ctrl.$onChanges = function() {
                if (ctrl.data) {
                	var parsed = [];
                	angular.forEach(ctrl.data, function(mutant) {
                		var next = mutant;
                		next.start = parseInt(mutant.coordinate.start);
                		next.end = parseInt(mutant.coordinate.end);
                		parsed.push(next);
                	});
                	
	                ctrl.chemParams = new NgTableParams({},{dataset: $filter('filter')(parsed, "EFO_0000370")});
	                ctrl.transParams = new NgTableParams({},{dataset: $filter('filter')(parsed, "EFO_0004021")});
	                ctrl.intronParams = new NgTableParams({},{dataset: $filter('filter')(parsed, "EFO_0004016")});
	                ctrl.recombParams = new NgTableParams({},{dataset: $filter('filter')(parsed, "EFO_0004293")});
                }
            };

        },
        templateUrl : '/static/build/js/angular_templates/mutants-view.min.html'
    });