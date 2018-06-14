angular.module('orthologView')

    .component('orthologView',
        {
            bindings : {
                locusTag : '<'
            },
            controller : "orthologCtrl",
            templateUrl : '/static/wiki/js/angular_templates/ortholog-view.html'
        })

    .controller('orthologCtrl', function(orthoData, InterPro, hostPathogen, GOTerms, OperonData, expressionTimingData, $filter) {

        'use strict';

        var ctrl = this;

        ctrl.data = {};
        orthoData.getOrthologs(ctrl.locusTag).then(function(response) {
            
            // now add results from sparql query
            angular.forEach(response.results.bindings, function(obj) {
                ctrl.hasOrthologs = true;
                
                ctrl.data[obj.orthoTaxid.value] = {
                    "locusTag" : obj.orthoLocusTag.value,
                    "taxid" : obj.orthoTaxid.value
                };
                
                
                // only query for protein coding genes
                if (obj.uniprot) {
                    // Get InterPro Domains from Wikidata SPARQL
                    InterPro.getInterPro(obj.uniprot.value).then(
                        function(data) {
                            ctrl.data[obj.orthoTaxid.value].ip = data.length > 0;
                        });

                    hostPathogen.getHostPathogen(obj.uniprot.value).then(
                        function(data) {
                            ctrl.data[obj.orthoTaxid.value].hp = data.length > 0;
                        });


                    GOTerms.getGoTerms(obj.uniprot.value).then(function(data) {
                        ctrl.data[obj.orthoTaxid.value].go = data.data.results.bindings.length > 0;
                    });
                } else {
                    ctrl.data[obj.orthoTaxid.value].ip = false;
                    ctrl.data[obj.orthoTaxid.value].hp = false;
                    ctrl.data[obj.orthoTaxid.value].go = false;
                }

                OperonData.getOperonData(obj.entrez.value).then(
                    function(data) {
                        ctrl.data[obj.orthoTaxid.value].operon = data.data.results.bindings.length > 0;
                    });

                expressionTimingData.getExpression(function(data) {
                    var current = $filter('keywordFilter')(data, obj.orthoLocusTag.value);
                    var currentExpression = {};
                    angular.forEach(current[0], function(value, key) {
                        if (key != '_id' && key != '$oid' && key != 'timestamp') {
                            currentExpression[key] = value;
                        }
                    });
                    ctrl.data[obj.orthoTaxid.value].expression = currentExpression.RB_EXPRESSION_TIMING != undefined;
                });

            });

        });

        // config settings for table
        ctrl.tSettings = {
            "strain" : true,
            "tax" : true,
            "cLocus" : true,
            "dLocus" : false,
            "identity" : false,
            "length" : false,
            "eval" : false,
            "ref" : true,
            "expression" : true,
            "go" : true,
            "operons" : true,
            "mutants" : false,
            "interpro" : true,
            "hostPathogen" : true
        };

    });