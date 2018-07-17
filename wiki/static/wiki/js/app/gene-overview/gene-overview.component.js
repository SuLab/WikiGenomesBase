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
            	ctrl.locusTag = $routeParams.locusTag;
            	ctrl.cm = ctrl.tm = ctrl.rm = ctrl.im = 0;
            };
            
            ctrl.$onChanges = function() {
            	console.log("FROM ON CHANGES");
            	console.log(ctrl.annotations);
            	angular.forEach(ctrl.annotations.mutants, function(x) {
            		console.log(x);
            		if (x.mutation_id=='EFO_0000370') {
            			ctrl.cm++;
            		} else if (x.mutation_id=='EFO_0004021') {
            			ctrl.tm++;
            		} else if (x.mutation_id=='EFO_0004016') {
            			ctrl.im++;
            		} else if (x.mutation_id=='EFO_0004293'){
            			ctrl.rm++;
            		}
            	});
            };
            
            var url_suf = $location.path() + '/mg_mutant_view';

            sendToView.sendToView(url_suf, {
                locusTag : ctrl.locusTag,
                taxid : ctrl.taxid
            }).then(function(data) {
            	console.log("HERE");
                console.log(data.data.mutants);
            });
            
        }
    });
