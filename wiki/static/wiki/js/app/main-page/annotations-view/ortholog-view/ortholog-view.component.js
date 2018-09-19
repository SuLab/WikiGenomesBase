angular.module('orthologView')

    .component('orthologView',
        {
            bindings : {
                locusTag : '<'
            },
            controller : "orthologCtrl",
            templateUrl : '/static/build/js/angular_templates/ortholog-view.min.html'
        })

    .controller('orthologCtrl', function(orthoDataByLocusTag, orthoDataByEntrez, appData, $routeParams, InterPro, hostPathogen, GOTerms, OperonData, expressionTimingData, $filter, sendToView, $location, taxidFilter, expressionBellandData) {

        'use strict';

        var ctrl = this;

        taxidFilter.map().then(function(data) {
           ctrl.tax2Name = data;
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
            "mutants" : true,
            "interpro" : true,
            "hostPathogen" : true,
            "entrez": false
        };

        ctrl.data = {};
        
        ctrl.reference = "";
        appData.getAppData(function (data) {

            var factory = orthoDataByLocusTag;

            if (data.primary_identifier == "entrez") {
                factory = orthoDataByEntrez;
                ctrl.useEntrez = true;
                ctrl.tSettings.entrez = true;
                ctrl.tSettings.cLocus = false;
            }

            factory.getOrthologs($routeParams.locusTag).then(function(response) {

                // now add results from sparql query
                angular.forEach(response.results.bindings, function(obj) {
                    ctrl.hasOrthologs = true;

                    if (ctrl.useEntrez) {
                        ctrl.data[obj.orthoTaxid.value] = {
                            "entrez" : obj.entrez.value,
                            "taxid" : obj.orthoTaxid.value,
                            "locusTag" : obj.entrez.value,
                        };
                    } else {
                        ctrl.data[obj.orthoTaxid.value] = {
                            "locusTag" : obj.orthoLocusTag.value,
                            "taxid" : obj.orthoTaxid.value
                        };
                    }

                    if (obj.reference) {
                        ctrl.reference = obj.reference.value;
                    }

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

                            var dataResults = data.data.results.bindings;

                            ctrl.data[obj.orthoTaxid.value].go = dataResults.length > 0;

                            var ecnumber = [];

                            // gather ec numbers from go terms
                            angular.forEach(dataResults, function(value, key) {
                                if (value.hasOwnProperty('ecnumber') && ecnumber.indexOf(value.ecnumber.value) == -1) {
                                    ecnumber.push(value.ecnumber.value);
                                }

                            });

                            // get mutant data
                            var annotation_keys;
                            if (ctrl.useEntrez) {
                                annotation_keys = {
                                    entrez : obj.entrez.value,
                                    taxid : obj.orthoTaxid.value,
                                    ec_number: ecnumber
                                };
                            } else {
                                annotation_keys = {
                                    locusTag : obj.orthoLocusTag.value,
                                    taxid : obj.orthoTaxid.value,
                                    ec_number: ecnumber
                                };
                            }
                            var url_suf = $location.path() + '/mg_mutant_view';
                            sendToView.sendToView(url_suf, annotation_keys).then(function(data) {

                                ctrl.data[obj.orthoTaxid.value].mutant = data.data.mutants.length > 0;
                            });

                        });
                    } else {
                        ctrl.data[obj.orthoTaxid.value].ip = false;
                        ctrl.data[obj.orthoTaxid.value].hp = false;
                        ctrl.data[obj.orthoTaxid.value].go = false;
                    }

                    if (data.primary_identifier == "locus_tag") {
                        OperonData.getOperonDataByLocusTag(obj.orthoLocusTag.value).then(
                            function (data) {
                                ctrl.data[obj.orthoTaxid.value].operon = data.data.results.bindings.length > 0;
                            });
                    } else {
                        OperonData.getOperonDataByLocusTag(obj.entrez.value).then(
                            function (data) {
                                ctrl.data[obj.orthoTaxid.value].operon = data.data.results.bindings.length > 0;
                            });
                    }

                    if (!ctrl.useEntrez) {
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
                        expressionBellandData.getExpression(function (data) {
                            if (data[obj.orthoLocusTag.value]) {
                                ctrl.data[obj.orthoTaxid.value].expression = true;
                            }
                        });
                    }

                });

            });
        });

    });