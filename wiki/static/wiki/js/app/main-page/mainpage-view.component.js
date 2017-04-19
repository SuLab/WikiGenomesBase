angular
    .module('mainPage')
    .component('mainPage', {
        controller: function ($filter,
                              $routeParams,
                              $location,
                              allChlamOrgs,
                              wdGetEntities,
                              entrez2QID,
                              orthoData,
                              GOTerms,
                              InterPro,
                              OperonData,
                              expasyData,
                              mutantData,
                              locusTag2Pub,
                              locusTag2QID) {
            //Main gene page component.
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.currentTaxid = $routeParams.taxid;
                ctrl.currentLocusTag = $routeParams.locusTag;
                console.log($routeParams);
                ctrl.currentGene = {};
                ctrl.annotations = {};
                locusTag2QID.getLocusTag2QID(ctrl.currentLocusTag, ctrl.currentTaxid).then(function (data) {
                    if (data.data.results.bindings.length > 0) {
                        ctrl.currentGene.geneQID = $filter('parseQID')(data.data.results.bindings[0].gene.value);
                        wdGetEntities.wdGetEntities(ctrl.currentGene.geneQID).then(function (data) {
                            var entity = data.entities[ctrl.currentGene.geneQID];
                            ctrl.currentGene.entrez = entity.claims.P351[0].mainsnak.datavalue.value;
                            ctrl.currentGene.geneLabel = entity.labels.en.value;
                            ctrl.currentGene.locusTag = entity.claims.P2393[0].mainsnak.datavalue.value;
                            ctrl.currentGene.geneDescription = entity.descriptions.en.value;
                            ctrl.currentGene.genStart = entity.claims.P644[0].mainsnak.datavalue.value;
                            ctrl.currentGene.genEnd = entity.claims.P645[0].mainsnak.datavalue.value;
                            ctrl.currentGene.strand = entity.claims.P2548[0].mainsnak.datavalue.value;
                            ctrl.currentGene.refseqGenome = entity.claims.P644[0].qualifiers.P2249[0].datavalue.value;
                            ctrl.currentGene.geneType = entity.claims.P279[0].mainsnak.datavalue.value;
                            ctrl.currentGene.geneAliases = [];
                            angular.forEach(entity.aliases.en, function (alias) {
                                if (alias.value != ctrl.currentGene.locusTag) {
                                    ctrl.currentGene.geneAliases.push(alias.value);
                                }
                            });
                            orthoData.getOrthologs(function (data) {
                                ctrl.orthologs = data;
                                var current = $filter('keywordFilter')(data, ctrl.currentGene.locusTag);
                                ctrl.currentOrtholog = {};
                                angular.forEach(current[0], function (value, key) {
                                    if (key != '_id' && key != '$oid' && key != 'timestamp') {
                                        ctrl.currentOrtholog[key] = value
                                    }
                                });
                                ctrl.annotations.orthologs = ctrl.currentOrtholog;
                            });

                            OperonData.getOperonData(ctrl.currentGene.entrez).then(
                                function (data) {
                                    var dataResults = data.data.results.bindings;
                                    if (dataResults.length > 0) {
                                        console.log(dataResults);
                                        ctrl.annotations.currentOperon = dataResults[0].operonItemLabel.value;
                                        console.log(ctrl.annotations.currentOperon);
                                        ctrl.opData = dataResults;
                                        ctrl.annotations.operons = dataResults;
                                    } else {
                                        ctrl.opData = [];
                                        ctrl.annotations.operons = [];
                                    }
                                });

                            mutantData.getKokesMutants(function (data) {
                                var mutants = [];
                                ctrl.mutantData = [];
                                mutants.push($filter('getJsonItemNoWD')('locus_tag_L2', ctrl.currentGene.locusTag, data));
                                if (ctrl.currentGene.locusTag) {
                                    mutants.push($filter('getJsonItemNoWD')('locus_tag_DUW3', ctrl.currentGene.locusTag, data));
                                    angular.forEach(mutants, function (value) {
                                        angular.forEach(value, function (val2) {
                                            ctrl.mutantData.push(val2);
                                        });
                                    });
                                }
                                ctrl.annotations.mutants = ctrl.mutantData;
                            });
                            var locus_tag = ctrl.currentGene.locusTag.replace('_', '');
                            locusTag2Pub.getlocusTag2Pub(locus_tag).then(function (data) {
                                ctrl.annotations.pubList = data.data.resultList.result;
                            });

                        });

                        ctrl.currentGene.proteinQID = $filter('parseQID')(data.data.results.bindings[0].protein.value);

                        wdGetEntities.wdGetEntities(ctrl.currentGene.proteinQID).then(function (data) {
                            var entity = data.entities[ctrl.currentGene.proteinQID];
                            ctrl.currentGene.proteinLabel = entity.labels.en.value;
                            ctrl.currentGene.description = entity.descriptions.en.value;
                            ctrl.currentGene.uniprot = entity.claims.P352[0].mainsnak.datavalue.value;
                            ctrl.currentGene.refseqProt = entity.claims.P637[0].mainsnak.datavalue.value;
                            ctrl.currentGene.productType = entity.claims.P279[0].mainsnak.datavalue.value;
                            ctrl.currentGene.proteinAliases = [];
                            angular.forEach(entity.aliases.en, function (alias) {
                                ctrl.currentGene.proteinAliases.push(alias.value);
                            });

                            InterPro.getInterPro(ctrl.currentGene.uniprot).then(
                                function (data) {
                                    ctrl.ipData = data;
                                    ctrl.annotations.interpro = data;
                                });

                            GOTerms.getGoTerms(ctrl.currentGene.uniprot).then(
                                function (data) {
                                    ctrl.annotations.go = {
                                        cellcomp: [],
                                        bioproc: [],
                                        molfunc: []
                                    };
                                    ctrl.annotations.reaction = {};
                                    ctrl.mf = 'mf_button';
                                    ctrl.bp = 'bp_button';
                                    ctrl.cc = 'cc_button';

                                    var dataResults = data.data.results.bindings;
                                    ctrl.annotations.ecnumber = [];
                                    angular.forEach(dataResults, function (value, key) {
                                        if (value.hasOwnProperty('ecnumber')) {
                                            ctrl.annotations.ecnumber.push(value.ecnumber.value);
                                            angular.forEach(ctrl.annotations.ecnumber, function (value) {
                                                if (value.indexOf('-') > -1) {
                                                    var multiReactions = "view reactions hierarchy at: http://enzyme.expasy.org/EC/" + value;
                                                    ctrl.annotations.reaction[value] = [multiReactions];
                                                } else {
                                                    expasyData.getReactionData(value).then(function (data) {
                                                        ctrl.annotations.reaction[data.ecnumber] = data.reaction;
                                                    });
                                                }
                                            });
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
                                });

                        });
                        allChlamOrgs.getAllOrgs(function (data) {
                            ctrl.orgList = data;
                            ctrl.currentOrg = $filter('getJsonItemOrg')('taxid', ctrl.currentTaxid, ctrl.orgList);
                            console.log(ctrl.currentOrg);
                            if (ctrl.currentOrg == undefined) {
                                alert("not a valid taxonomy id");
                                $location.path('/');
                            }
                        });

                    }
                    else{
                        alert(ctrl.currentLocusTag + " doesn't seem to be a gene in this genome.");
                        $location.path('/organism/' + ctrl.currentTaxid);
                    }
                });

            };
        },
        templateUrl: '/static/wiki/js/angular_templates/main-page_new.html'
    });


