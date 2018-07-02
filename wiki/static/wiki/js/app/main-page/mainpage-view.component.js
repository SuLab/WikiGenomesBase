angular
    .module('mainPage')
    .component('mainPage', {
        controller : function($filter,
            $routeParams,
            $location,
            allChlamOrgs,
            wdGetEntities,
            entrez2QID,
            GOTerms,
            InterPro,
            OperonData,
            expasyData,
            mutantData,
            locusTag2Pub,
            locusTag2QID,
            sendToView,
            expressionTimingData,
            hostPathogen,
            RefSeqChrom,
            allOrgGenes

        ) {

            // Main gene page component. Loaded when a gene is selected.  Parses the url for taxid and locus tag and uses
            // those to make API calls to wikidata.
            var ctrl = this;
            ctrl.$onInit = function() {
                'use strict';
                ctrl.currentTaxid = $routeParams.taxid;
                ctrl.currentLocusTag = $routeParams.locusTag;
                ctrl.currentGene = {
                    locusTag : ctrl.currentLocusTag,
                    taxid : ctrl.currentTaxid
                };
                ctrl.annotations = {
                    ecnumber : []
                };

                // get all gene data for gene search
                allOrgGenes.getAllOrgGenes(ctrl.currentTaxid)
                    .then(function(data) {
                        var dataResults = data.data.results.bindings;
                        ctrl.currentAllGenes = $filter('orderObjectBy')(dataResults, 'genStart');
                    });

                // get all organism data for forms
                allChlamOrgs.getAllOrgs(function(data) {
                    ctrl.orgList = data;
                    ctrl.currentOrg = $filter('getJsonItemOrg')('taxid', ctrl.currentTaxid, ctrl.orgList);
                    if (ctrl.currentOrg == undefined) {
                        alert("not a valid taxonomy id");
                        $location.path('/');
                    }
                });

                ctrl.hasprotein = true;

                locusTag2QID.getLocusTag2QID(ctrl.currentLocusTag, ctrl.currentTaxid).then(function(data) {
                    var results = data.data.results.bindings;
                    if (results.length > 0) {
                        ctrl.currentGene.geneQID = $filter('parseQID')(results[0].gene.value);
                        if (results[0].protein) {
                            ctrl.currentGene.proteinQID = $filter('parseQID')(results[0].protein.value);
                        } else {
                            ctrl.hasprotein = false;
                        }

                    } else {
                        alert(ctrl.currentLocusTag + " doesn't seem to be a gene in this genome.");
                        $location.path('/organism/' + ctrl.currentTaxid);

                    }
                }).finally(function() {
                    wdGetEntities.wdGetEntities(ctrl.currentGene.geneQID).then(function(data) {
                        var entity = data.entities[ctrl.currentGene.geneQID];
                        ctrl.currentGene.entrez = entity.claims.P351[0].mainsnak.datavalue.value;
                        ctrl.currentGene.geneLabel = entity.labels.en.value;
                        ctrl.currentGene.locusTag = entity.claims.P2393[0].mainsnak.datavalue.value;
                        ctrl.currentGene.geneDescription = entity.descriptions.en.value;
                        ctrl.currentGene.genStart = entity.claims.P644[0].mainsnak.datavalue.value;
                        ctrl.currentGene.genEnd = entity.claims.P645[0].mainsnak.datavalue.value;
                        ctrl.currentGene.strand = entity.claims.P2548[0].mainsnak.datavalue.value;
                        ctrl.currentGene.geneType = entity.claims.P279[0].mainsnak.datavalue.value;
                        ctrl.currentGene.geneAliases = [];
                        angular.forEach(entity.aliases.en, function(alias) {
                            if (alias.value != ctrl.currentGene.locusTag) {
                                ctrl.currentGene.geneAliases.push(alias.value);
                            }
                        });
                    });

                    if (ctrl.currentGene.proteinQID) {
                        wdGetEntities.wdGetEntities(ctrl.currentGene.proteinQID).then(function(data) {

                            var entity = data.entities[ctrl.currentGene.proteinQID];
                            ctrl.currentGene.proteinLabel = entity.labels.en.value;
                            ctrl.currentGene.description = entity.descriptions.en.value;
                            ctrl.currentGene.uniprot = entity.claims.P352[0].mainsnak.datavalue.value;
                            ctrl.currentGene.refseqProt = entity.claims.P637[0].mainsnak.datavalue.value;
                            ctrl.currentGene.productType = entity.claims.P279[0].mainsnak.datavalue.value;
                            ctrl.currentGene.proteinAliases = [];
                            angular.forEach(entity.aliases.en, function(alias) {
                                ctrl.currentGene.proteinAliases.push(alias.value);
                            });

                            // Get InterPro Domains from Wikidata SPARQL
                            InterPro.getInterPro(ctrl.currentGene.uniprot).then(
                                function(data) {
                                    ctrl.ipData = data;
                                    ctrl.annotations.interpro = data;
                                });

                            hostPathogen.getHostPathogen(ctrl.currentGene.uniprot).then(
                                function(data) {
                                    ctrl.hostpathData = data;
                                    ctrl.annotations.hostpath = data;
                                });


                            // Get go terms and EC numbers from WIKIDATA SPARQL
                            GOTerms.getGoTerms(ctrl.currentGene.uniprot).then(function(data) {
                                
                                    ctrl.annotations.go = {
                                        cellcomp : [],
                                        bioproc : [],
                                        molfunc : []
                                    };
                                    ctrl.annotations.reaction = {};
                                    ctrl.mf = 'mf_button';
                                    ctrl.bp = 'bp_button';
                                    ctrl.cc = 'cc_button';

                                    var dataResults = data.data.results.bindings;

                                    // gather ec numbers from go terms
                                    angular.forEach(dataResults, function(value, key) {
                                        if (value.hasOwnProperty('ecnumber') && ctrl.annotations.ecnumber.indexOf(value.ecnumber.value) == -1) {
                                            ctrl.annotations.ecnumber.push(value.ecnumber.value);
                                        }
                                        if (value.goclass.value === 'http://www.wikidata.org/entity/Q5058355') {
                                            ctrl.annotations.go.cellcomp.push(value);

                                        }
                                        if (value.goclass.value === 'http://www.wikidata.org/entity/Q14860489') {
                                            ctrl.annotations.go.molfunc.push(value);

                                        }
                                        if (value.goclass.value === 'http://www.wikidata.org/entity/Q2996394') {
                                            ctrl.annotations.go.bioproc.push(value);
                                        }

                                    });
                                    
                                    // now update enzyme data from ec numbers
                                    angular.forEach(ctrl.annotations.ecnumber, function(value) {
                                        if (value.indexOf('-') === -1 && value.indexOf('.') != -1) {
                                            expasyData.getReactionData(value).then(function(data) {
                                                console.log(data);
                                                ctrl.annotations.reaction[data.ecnumber] = data.reaction;
                                            });
                                        }
                                    });

                                    // This gets server side mongodb annotations.  Nested in GO Terms function because of AJAX
                                    // issues waiting for EC Number.  NEED to refactor so it can be called outside of this.
                                    var annotation_keys = {
                                        locusTag : ctrl.currentGene.locusTag,
                                        taxid : ctrl.currentGene.taxid,
                                        ec_number : ctrl.annotations.ecnumber
                                    };
                                    getServerAnnotationData(annotation_keys);
                                });
                        });

                    }

                    // Get operon data from wikidata sparql query
                    OperonData.getOperonData(ctrl.currentGene.entrez).then(
                        function(data) {
                            var dataResults = data.data.results.bindings;
                            if (dataResults.length > 0) {
                                ctrl.annotations.currentOperon = dataResults[0].operonItemLabel.value;
                                ctrl.opData = dataResults;
                                ctrl.annotations.operons = dataResults;
                            } else {
                                ctrl.opData = [];
                                ctrl.annotations.operons = [];
                            }
                        });

                    // Get chromosome refseq id
                    RefSeqChrom.getRefSeqChrom(ctrl.currentLocusTag).then(function(data) {
                        console.log(data);

                        if (data[0]) {
                            ctrl.currentGene.refseqGenome = data[0].refSeqChromosome.value;
                        }

                    });

                    expressionTimingData.getExpression(function(data) {
                        ctrl.expression = data;
                        var current = $filter('keywordFilter')(data, ctrl.currentLocusTag);
                        ctrl.currentExpression = {};
                        angular.forEach(current[0], function(value, key) {
                            if (key != '_id' && key != '$oid' && key != 'timestamp') {
                                ctrl.currentExpression[key] = value;
                            }
                        });
                        ctrl.annotations.expression = ctrl.currentExpression;
                    });


                    // Get related publications from eutils
                    var locus_tag = ctrl.currentGene.locusTag.replace('_', '');
                    locusTag2Pub.getlocusTag2Pub(locus_tag).then(function(data) {
                        ctrl.annotations.pubList = data.data.resultList.result;
                    });

                });

                ////send form data to server to edit wikidata
                var getServerAnnotationData = function(anno_keys) {
                    var url_suf = $location.path() + '/mg_mutant_view';

                    sendToView.sendToView(url_suf, anno_keys).then(function(data) {
                    	
                        ctrl.annotations.mutants = {
                            mutants : data.data.mutants,
                            refseq : ctrl.currentGene.refseqGenome
                        };
                    });
                };


            };

        },
        templateUrl : '/static/wiki/js/angular_templates/main-page_new.html'
    });