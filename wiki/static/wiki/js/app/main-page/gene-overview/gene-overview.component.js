angular
    .module('geneOverview')
    .component('geneOverview', {
        templateUrl: '/static/build/js/angular_templates/gene-overview.min.html',
        bindings: {
            data: '<',
            annotations: '<'
        },
        controller: function ($routeParams, sendToView, $location, taxidFilter, appData, annotationSettings) {
            'use strict';
            var ctrl = this;

            ctrl.settings = {
                product : true,
                ortholog : true,
                alignment: true,
                expression : true,
                go : true,
                localizations: true,
                operon : true,
                interpro : true,
                enzyme : true,
                mutants : true,
                hostpath : true,
                pubs : true,
                history: true,
                movie: true
            };

            annotationSettings.getSettings().then(function(response) {
                ctrl.settings = {
                    product : ctrl.settings.product && response.data["protein-view"],
                    ortholog : ctrl.settings.ortholog && response.data["ortholog-view"],
                    alignment: ctrl.settings.alignment && response.data["alignment-view"],
                    expression : ctrl.settings.expression && response.data["expression-view"],
                    go : ctrl.settings.go && response.data["function-view"],
                    localizations: ctrl.settings.localizations && response.data["localization-view"],
                    operon : ctrl.settings.operon && response.data["operon-view"],
                    interpro : ctrl.settings.interpro && response.data["interpro-view"],
                    enzyme : ctrl.settings.enzyme && response.data["enzyme-view"],
                    mutants : ctrl.settings.mutants && response.data["mutant-view"],
                    hostpath : ctrl.settings.hostpath && response.data["protein-interaction-view"],
                    pubs : ctrl.settings.pubs && response.data["related-publication-view"],
                    history: ctrl.settings.history && response.data["revision-history-view"],
                    movie: ctrl.settings.movie && response.data["movie-data-view"],
                };
            });

            ctrl.$onInit = function () {
            	ctrl.taxid = $routeParams.taxid;
            	ctrl.locusTag = $routeParams.locusTag;
            	ctrl.cm = ctrl.tm = ctrl.rm = ctrl.im = 0;

            	appData.getAppData(function(data) {
                    ctrl.useEntrez = data.primary_identifier == "entrez";
                });

                taxidFilter.species(ctrl.taxid).then(function(data) {
                    ctrl.species = data;
                });
                taxidFilter.strain(ctrl.taxid).then(function(data) {
                    ctrl.strain = data;
                });

                var url_suf = $location.path() + '/mg_mutant_view';
                sendToView.sendToView(url_suf, {
                    locusTag : ctrl.locusTag,
                    taxid : ctrl.taxid
                }).then(function(data) {
                	angular.forEach(data.data.mutants, function(x) {
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
                });
                
            };

            ctrl.checkAuthorization = function(modal) {
                if (!$location.path().includes("authorized")) {
                    $("#errorGene").modal('show');
                } else {
                    $("#" + modal).modal('show');
                }
            };
        }
    });
