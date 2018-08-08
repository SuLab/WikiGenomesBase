angular
    .module('genesKeyword')
    .component('genesKeyword', {
        controller: function ($location, $filter, allChlamOrgs, allChlamydiaGenes, queryBuilder, $http, allGoTerms, sendToView, $cacheFactory, appData, NgTableParams) {
            'use strict';
            var ctrl = this;

            appData.getAppData(function (data) {
                ctrl.appData = data;
            });

            ctrl.$onInit = function () {
                ctrl.loading = true;
                ctrl.chlamGenes = {};

                ctrl.tableParams = new NgTableParams();

                ctrl.onSelect = function ($item) {
                    $location.path('/organism/' + $item.taxid.value + "/gene/" + $item.locusTag.value);
                };
                ctrl.longTitle = function ($item) {
                    if ($item.length > 80) {
                        return $item;
                    } else {
                        return '';
                    }
                };

                ctrl.keyword = $location.path().split("/")[2];
                ctrl.keywordResult = ctrl.keyword;
                var cache = $cacheFactory.get("advSearch");
                if (cache) {
                    ctrl.adv_cache = true;
                    ctrl.mf = cache.get("mf")[0];
                    ctrl.mf_text = cache.get("mf")[1];
                    ctrl.bp = cache.get("bp")[0];
                    ctrl.bp_text = cache.get("bp")[1];
                    ctrl.cc = cache.get("cc")[0];
                    ctrl.cc_text = cache.get("cc")[1];
                    ctrl.hp = cache.get("hp")[0];
                    ctrl.hp_text = cache.get("hp")[1];
                    ctrl.entrez = cache.get("entrez")[0];
                    ctrl.entrez_text = cache.get("entrez")[1];
                    ctrl.uniprot = cache.get("uniprot")[0];
                    ctrl.uniprot_text = cache.get("uniprot")[1];
                    ctrl.refseq = cache.get("refseq")[0];
                    ctrl.refseq_text = cache.get("refseq")[1];
                    ctrl.pdb = cache.get("pdb")[0];
                    ctrl.pdb_text = cache.get("pdb")[1];
                    ctrl.cm = cache.get("cm");
                    ctrl.tm = cache.get("tm");
                    ctrl.im = cache.get("im");
                    ctrl.rm = cache.get("rm");

                    cache.removeAll();
                    cache.destroy();

                    ctrl.advSearch();
                }

                ctrl.orgData = [];
                allChlamOrgs.getAllOrgs(function (data) {
                    angular.forEach(data, function (value) {
                        value.check = true;
                        ctrl.orgData.push(value);
                    });
                });
                if (!ctrl.adv_cache) {
                    ctrl.getChlamGenes = allChlamydiaGenes.getAllChlamGenes().then(
                        function (data) {

                            ctrl.chlamGenes.allGenes = data.data.results.bindings;
                            ctrl.chlamGenes.keywordAll = $filter('keywordFilter')(ctrl.chlamGenes.allGenes, ctrl.keyword);
                            ctrl.tableParams.settings({dataset: ctrl.chlamGenes.keywordAll});
                            console.log(ctrl.tableParams);

                        }).finally(function () {
                        ctrl.loading = false;
                    });
                }

                var goClassMap = {
                    'mf_button': {
                        name: 'Molecular Function',
                        QID: 'Q14860489'
                    },
                    'cc_button': {
                        name: 'Cellular Component',
                        QID: 'Q5058355'
                    },
                    'bp_button': {
                        name: 'Biological Process',
                        QID: 'Q2996394'
                    }
                };

                ctrl.mfTerms = function (val) {
                    return allGoTerms.getGoTermsAll(val, goClassMap.mf_button.QID).then(function (data) {
                        return data.data.results.bindings.map(function (item) {
                            return item;
                        });
                    });
                };

                ctrl.ccTerms = function (val) {
                    return allGoTerms.getGoTermsAll(val, goClassMap.cc_button.QID).then(function (data) {
                        return data.data.results.bindings.map(function (item) {
                            return item;
                        });
                    });
                };

                ctrl.bpTerms = function (val) {
                    return allGoTerms.getGoTermsAll(val, goClassMap.bp_button.QID).then(function (data) {
                        return data.data.results.bindings.map(function (item) {
                            return item;
                        });
                    });
                };

            };

            ctrl.facetOrganism = function (organism) {
                ctrl.currentOrgsList = [];
                angular.forEach(ctrl.orgData, function (value) {
                    if (value.check == true) {
                        ctrl.currentOrgsList.push(value.taxid);
                    }
                });
                ctrl.tableParams.data = $filter('deleteJsonItemValuesList')('taxid', ctrl.currentOrgsList, ctrl.chlamGenes.keywordAll);
            };

            ctrl.advSearch = function () {
                ctrl.loading = true;
                ctrl.keywordResult = ctrl.keyword;
                ctrl.tableParams.data = [];

                $('.collapse').collapse("hide");

                var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
                var url = endpoint + encodeURIComponent(ctrl.buildQuery());
                $http.get(url).then(function (data) {
                    ctrl.chlamGenes.allGenes = data.data.results.bindings;
                    ctrl.chlamGenes.keywordAll = $filter('keywordFilter')(ctrl.chlamGenes.allGenes, ctrl.keyword);

                    var url_surf = "organism/1/gene/1/mg_mutant_view";

                    // number of mutant filters to apply
                    var count = 0;
                    if (ctrl.cm) {
                        count++;
                    }
                    if (ctrl.tm) {
                        count++;
                    }
                    if (ctrl.im) {
                        count++;
                    }
                    if (ctrl.rm) {
                        count++;
                    }

                    // no mutants to filter
                    if (count == 0) {
                        ctrl.tableParams.settings({dataset: ctrl.chlamGenes.keywordAll});
                        ctrl.loading = false;
                        return;
                    }

                    if (ctrl.cm) {
                        sendToView.sendToView(url_surf, {"action": "chemical"}).then(function (data) {
                            var mutants = data.data.mutants;
                            var tags = [];
                            angular.forEach(mutants, function (mutant) {
                                if (tags.indexOf(mutant.locusTag) == -1) {
                                    tags.push(mutant.locusTag);
                                }
                            });
                            ctrl.chlamGenes.keywordAll = $filter('locusTagFilter')(ctrl.chlamGenes.keywordAll, tags);
                            count--;
                            if (count == 0) {
                                ctrl.tableParams.settings({dataset: ctrl.chlamGenes.keywordAll});
                                ctrl.loading = false;
                                return;
                            }
                        });
                    }

                    if (ctrl.tm) {
                        sendToView.sendToView(url_surf, {"action": "transposition"}).then(function (data) {
                            var mutants = data.data.mutants;
                            var tags = [];
                            angular.forEach(mutants, function (mutant) {
                                if (tags.indexOf(mutant.locusTag) == -1) {
                                    tags.push(mutant.locusTag);
                                }
                            });
                            ctrl.chlamGenes.keywordAll = $filter('locusTagFilter')(ctrl.chlamGenes.keywordAll, tags);
                            count--;
                            if (count == 0) {
                                ctrl.tableParams.settings({dataset: ctrl.chlamGenes.keywordAll});
                                ctrl.loading = false;
                                return;
                            }
                        });
                    }

                    if (ctrl.rm) {
                        sendToView.sendToView(url_surf, {"action": "recombination"}).then(function (data) {
                            var mutants = data.data.mutants;
                            var tags = [];
                            angular.forEach(mutants, function (mutant) {
                                if (tags.indexOf(mutant.locusTag) == -1) {
                                    tags.push(mutant.locusTag);
                                }
                            });
                            ctrl.chlamGenes.keywordAll = $filter('locusTagFilter')(ctrl.chlamGenes.keywordAll, tags);
                            count--;
                            if (count == 0) {
                                ctrl.tableParams.settings({dataset: ctrl.chlamGenes.keywordAll});
                                ctrl.loading = false;
                                return;
                            }
                        });
                    }

                    if (ctrl.im) {
                        sendToView.sendToView(url_surf, {"action": "insertion"}).then(function (data) {
                            var mutants = data.data.mutants;
                            var tags = [];
                            angular.forEach(mutants, function (mutant) {
                                if (tags.indexOf(mutant.locusTag) == -1) {
                                    tags.push(mutant.locusTag);
                                }
                            });
                            ctrl.chlamGenes.keywordAll = $filter('locusTagFilter')(ctrl.chlamGenes.keywordAll, tags);
                            count--;
                            if (count == 0) {
                                ctrl.tableParams.settings({dataset: ctrl.chlamGenes.keywordAll});
                                ctrl.loading = false;
                                return;
                            }
                        });
                    }

                });

            };

            ctrl.startJS = function () {

                $('.collapse').collapse("show");

                // set options for introjs
                var intro = introJs().setOption("skipLabel", "Exit");
                intro.setOption("showStepNumbers", "false");
                intro.hideHints();

                // now start it
                intro.start();
            };

            ctrl.buildQuery = function () {
                var query = queryBuilder.beginning();

                if (ctrl.entrez) {
                    if (ctrl.entrez_text) {
                        query += queryBuilder.equals("?gene", "entrez", ctrl.entrez_text);
                    } else {
                        query += queryBuilder.triple("?gene", "entrez", "?entrez");
                    }
                } else {
                    query += queryBuilder.optional(queryBuilder.triple("?gene", "entrez", "?entrez"));
                }

                var inner = "";

                if (ctrl.uniprot) {
                    if (ctrl.uniprot_text) {
                        inner += queryBuilder.equals("?protein", "uniprot", ctrl.uniprot_text);
                    } else {
                        inner += queryBuilder.triple("?protein", "uniprot", "?uniprot");
                    }
                } else {
                    inner += queryBuilder.optional(queryBuilder.triple("?protein", "uniprot", "?uniprot"));
                }

                if (ctrl.pdb) {
                    if (ctrl.pdb_text) {
                        inner += queryBuilder.equals("?protein", "pdb", ctrl.pdb_text);
                    } else {
                        inner += queryBuilder.triple("?protein", "pdb", "?pdb");
                    }
                } else {
                    inner += queryBuilder.optional(queryBuilder.triple("?protein", "pdb", "?pdb"));
                }

                if (ctrl.refseq) {
                    if (ctrl.refseq_text) {
                        inner += queryBuilder.equals("?protein", "refseq", ctrl.refseq_text);
                    } else {
                        inner += queryBuilder.triple("?protein", "refseq", "?refseq");
                    }

                } else {
                    inner += queryBuilder.optional(queryBuilder.triple("?protein", "refseq", "?refseq"));
                }

                if (ctrl.mf) {
                    inner += queryBuilder.addLabel("?protein", "mf", "?mfLabel");
                    inner += queryBuilder.filterEnglish('?mfLabel');
                } else {
                    inner += queryBuilder.optional(queryBuilder.addLabel("?protein", "mf", "?mfLabel") + queryBuilder.filterEnglish('?mfLabel'));
                }

                if (ctrl.bp) {
                    inner += queryBuilder.addLabel("?protein", "bp", "?bpLabel");
                    inner += queryBuilder.filterEnglish('?bpLabel');
                } else {
                    inner += queryBuilder.optional(queryBuilder.addLabel("?protein", "bp", "?bpLabel") + queryBuilder.filterEnglish('?bpLabel'));
                }

                if (ctrl.cc) {
                    inner += queryBuilder.addLabel("?protein", "cc", "?ccLabel");
                    inner += queryBuilder.filterEnglish('?ccLabel');
                } else {
                    inner += queryBuilder.optional(queryBuilder.addLabel("?protein", "cc", "?ccLabel") + queryBuilder.filterEnglish('?ccLabel'));
                }

                if (ctrl.hp) {
                    inner += queryBuilder.addLabel("?protein", "hp", "?host_protein");
                } else {
                    inner += queryBuilder.optional(queryBuilder.addLabel("?protein", "hp", "?host_protein"));
                }

                if (ctrl.uniprot || ctrl.refseq || ctrl.mf || ctrl.bp || ctrl.cc || ctrl.hp || ctrl.pdb) {
                    query += queryBuilder.triple("?gene", "protein", "?protein");
                    query += inner;
                } else {
                    inner = queryBuilder.triple("?gene", "protein", "?protein") + inner;
                    query += queryBuilder.optional(inner);
                }

                if (ctrl.mf && ctrl.mf_text) {
                    query += queryBuilder.filter("?mfLabel", ctrl.mf_text);
                }

                if (ctrl.cc && ctrl.cc_text) {
                    query += queryBuilder.filter("?ccLabel", ctrl.cc_text);
                }

                if (ctrl.bp && ctrl.bp_text) {
                    query += queryBuilder.filter("?bpLabel", ctrl.bp_text);
                }

                if (ctrl.hp && ctrl.hp_text) {
                    query += queryBuilder.filter("?host_protein", ctrl.hp_text);
                }

                query += queryBuilder.ending();

                console.log("QUERY:");
                console.log(query);

                return query;

            };

        },
        templateUrl: '/static/build/js/angular_templates/genes-keyword-browser.min.html'
    }).factory('queryBuilder', function () {

    var pMap = {
        entrez: 'wdt:P351',
        uniprot: 'wdt:P352',
        refseq: 'wdt:P637',
        mf: 'wdt:P680',
        cc: 'wdt:P681',
        bp: 'wdt:P682',
        protein: 'wdt:P688',
        hp: 'wdt:P129',
        pdb: 'wdt:P638'
    };

    var optional = function (input) {
        return "OPTIONAL {" + input + "}";
    };

    var filter = function (term, keyword) {
        return "FILTER(CONTAINS(LCASE(" + term + "), '" + keyword.toLowerCase() + "')).";
    };

    var equals = function (key, property, value) {
        return key + " " + pMap[property] + " '" + value + "'.";
    };

    var filterEnglish = function (keyword) {
        return "FILTER(LANG(" + keyword + ") = 'en').";
    };

    var beginning = function () {
        return "SELECT ?taxon ?taxid ?taxonLabel ?geneLabel ?entrez ?uniprot ?proteinLabel ?locusTag ?refseq_prot ?gene ?pdb" +
            "(GROUP_CONCAT(DISTINCT ?aliases) AS ?aliases) (GROUP_CONCAT(DISTINCT ?mfLabel) AS ?mfLabel) " +
            "(GROUP_CONCAT(DISTINCT ?bpLabel) AS ?bpLabel) (GROUP_CONCAT(DISTINCT ?ccLabel) AS ?ccLabel) (GROUP_CONCAT(DISTINCT ?host_protein) AS ?host_protein) WHERE {" +
            "?taxon wdt:P171* wd:Q846309." +
            "?gene wdt:P279 wd:Q7187." +
            "?gene wdt:P703 ?taxon." +
            "?gene wdt:P2393 ?locusTag." +
            "?gene skos:altLabel ?aliases.";
    };

    var ending = function () {
        return "?taxon wdt:P685 ?taxid." +
            "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }" +
            "}" +
            "GROUP BY ?locusTag ?taxon ?taxid ?taxonLabel ?geneLabel ?entrez ?uniprot ?proteinLabel ?refseq_prot ?gene ?pdb";
    };

    var addLabel = function (keyword, property, term) {
        return keyword + " " + pMap[property] + "/rdfs:label " + term + ".";
    };

    var triple = function (key, property, value) {
        return key + " " + pMap[property] + " " + value + ".";
    };

    return {
        optional: optional,
        filter: filter,
        equals: equals,
        filterEnglish: filterEnglish,
        beginning: beginning,
        ending: ending,
        addLabel: addLabel,
        triple: triple,

    };


});
