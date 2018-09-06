angular
    .module('annotationsView')
    .component('annotationsView', {
        templateUrl : '/static/build/js/angular_templates/annotations-view.min.html',
        bindings : {
            data : '<',
            annotations : '<',
            org : '<',
            allorggenes : "<",
            hasprotein : "<"
        },
        controller : function(annotationSettings) {
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
                    pubs : true
                };
            
            ctrl.map = {
            		product : "Gene Product",
                	ortholog : "Orthologs",
                	alignment: "Alignments",
                	expression : "Expression",
                    go : "Functions",
                    localizations: "Localizations",
                    operon : "Operons",
                    interpro : "Interpro",
                    enzyme : "Enzyme",
                    mutants : "Mutants",
                    hostpath : "Protein Interactions",
                    pubs : "Related Pubs"
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
                        pubs : ctrl.settings.pubs && response.data["related-publication-view"]
                    };
            	
                ctrl.table = [];
                var index = 0;
                var count = 0;
                angular.forEach(ctrl.settings, function(value, key) {
                	 if (value) {
                		 if (count != 0 && count % 6 == 0) {
                			 index++;
                		 }
                		 if (!ctrl.table[index]) {
                			 ctrl.table[index] = [key];
                		 } else {
                			 ctrl.table[index].push(key);
                		 }
                		 count++;
                	 }
                });
                
            });

            ctrl.$onChanges = function(changes) {
                if (changes.hasprotein && changes.hasprotein.currentValue == false) {
                    // settings for visibility of each annotation view
                    ctrl.settings.product = false;
                    ctrl.settings.go = false;
                    ctrl.settings.localizations = false;
                    ctrl.settings.interpro = false;
                    ctrl.settings.enzyme = false;
                    ctrl.settings.hostpath = false;
                }
                
            };

            ctrl.$onInit = function() {

                //buttons for expanding and collapsing accordion
                ctrl.expandAll = function() {
                    ctrl.toggleOpen(true);
                };
                ctrl.collapseAll = function() {
                    ctrl.toggleOpen(false);
                };
                ctrl.accordion = {
                    go : true,
                    operon : true,
                    interpro : true,
                    enzyme : true,
                    mutants : true,
                    pubs : true,
                    product : true,
                    ortholog : true,
                    alignment: true,
                    expression : true,
                    hostpath : true,
                    localizations : true,
                };

                ctrl.toggleOpen = function(openAll) {
                    ctrl.accordion.go = openAll;
                    ctrl.accordion.operon = openAll;
                    ctrl.accordion.interpro = openAll;
                    ctrl.accordion.enzyme = openAll;
                    ctrl.accordion.mutants = openAll;
                    ctrl.accordion.pubs = openAll;
                    ctrl.accordion.product = openAll;
                    ctrl.accordion.ortholog = openAll;
                    ctrl.accordion.alignment = openAll;
                    ctrl.accordion.hostpath = openAll;
                    ctrl.accordion.expression = openAll;
                    ctrl.accordion.localizations = openAll;
                };

                ctrl.status = {
                    isCustomHeaderOpen : false,
                    isFirstOpen : true,
                    isFirstDisabled : false
                };
            };
       
        }
    });