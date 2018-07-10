angular
    .module('geneOntology')
    .component('geneOntology', {
        templateUrl: '/static/build/js/angular_templates/gene-ontology-view.min.html',
        bindings: {
            data: '<',
            goclass: '@',
            gene: '<'
        },
        controller: function () {
            'use strict';
            var ctrl = this;
            ctrl.$onChanges = function () {
            	
            	if (ctrl.data) {
	            	angular.forEach(ctrl.data, function(value) {
	            		value.determinationLabel.values = value.determinationLabel.value.split(";");
	            	});
            	}
            };
            
            ctrl.evidenceCodes = {
                    "IEA": "Inferred From Electronic Annotation",
                    "EXP": "Inferred from Experiment",
                    "IDA": "Inferred from Direct Assay",
                    "IPI": "Inferred From Physical Interaction",
                    "IMP": "Inferred from Mutant Phenotype",
                    "IGI": "Inferred from Genetic Interaction",
                    "IEP": "Inferred from Expression Pattern",
                    "ISS": "Inferred From Sequence or structural Similarity",
                    "ISO": "Inferred from Sequence Orthology",
                    "ISA": "Inferred from Sequence Alignment",
                    "ISM": "Inferred From Sequence Model",
                    "IGC": "Inferred from Genomic Context",
                    "IBA": "Inferred from Biological aspect of Ancestor",
                    "IBD": "Inferred from Biological aspect of Descendant",
                    "IKR": "Inferred From Key Residues",
                    "IRD": "Inferred from Rapid Divergence",
                    "RCA": "Inferred from Reviewed Computational Analysis",
                    "TAS": "Traceable Author Statement",
                    "NAS": "Non traceable author statement",
                    "IC": "Inferred by Curator",
                    "ND": "No biological Data available"
            };
        }
    });