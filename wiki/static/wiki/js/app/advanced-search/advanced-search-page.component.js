angular
    .module('advSearchPage')
    .component('advSearchPage', {
        controller: function ($location, $filter, allSpeciesGenes, queryBuilder, $http, allGoTerms, sendToView, $cacheFactory, appData, NgTableParams, expressionTimingData, allOrgs) {
            'use strict';
            var ctrl = this;

            ctrl.$onInit = function () {
                ctrl.speciesGenes = {};

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

                ctrl.loadCache = function () {
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
                        ctrl.rb = cache.get("rb");
                        ctrl.eb = cache.get("eb");
                        ctrl.bacp = cache.get("bacp")[0];
                        ctrl.bacp_text = cache.get("bacp")[1];
                        ctrl.orgData = cache.get("orgs");
                        ctrl.constitutive = cache.get("constitutive");
                        ctrl.early = cache.get("early");
                        ctrl.mid = cache.get("mid");
                        ctrl.mid_late = cache.get("mid_late");
                        ctrl.late = cache.get("late");
                        ctrl.very_late = cache.get("very_late");
                    } else {
                        ctrl.orgData = [];
                        allOrgs.getAllOrgs(function (data) {
                            angular.forEach(data, function (value) {
                                value.check = true;
                                ctrl.orgData.push(value);
                            });
                        });
                    }
                };

                ctrl.loadCache();

                // getting all species genes requries getting app data's parent taxid first
                if (!ctrl.adv_cache && ctrl.keyword != "") {
                    ctrl.loading = true;
                }

                appData.getAppData(function (data) {
                    ctrl.appData = data;

                    if (!ctrl.adv_cache && ctrl.keyword != "") {
                        allSpeciesGenes.getAllSpeciesGenes(ctrl.appData.parent_taxid).then(
                            function (data) {

                                ctrl.speciesGenes.allGenes = data.data.results.bindings;
                                ctrl.speciesGenes.keywordAll = $filter('keywordFilter')(ctrl.speciesGenes.allGenes, ctrl.keyword);
                                ctrl.tableParams.settings({dataset: ctrl.speciesGenes.keywordAll});

                            }).finally(function () {
                            ctrl.loading = false;
                        });
                    }
                });


                ctrl.advSearch = function () {
                    ctrl.loading = true;

                    ctrl.loadCache();

                    ctrl.keywordResult = ctrl.keyword;

                    $('.collapse').collapse("hide");

                    var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
                    var url = endpoint + encodeURIComponent(ctrl.buildQuery());
                    $http.get(url).then(function (data) {
                        ctrl.speciesGenes.allGenes = data.data.results.bindings;
                        ctrl.speciesGenes.keywordAll = $filter('keywordFilter')(ctrl.speciesGenes.allGenes, ctrl.keyword);

                        // filter by organism
                        ctrl.currentOrgsList = [];
                        angular.forEach(ctrl.orgData, function (value) {
                            if (value.check == true) {
                                ctrl.currentOrgsList.push(value.taxid);
                            }
                        });
                        ctrl.speciesGenes.keywordAll = $filter('deleteJsonItemValuesList')('taxid', ctrl.currentOrgsList, ctrl.speciesGenes.keywordAll);

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
                        if (ctrl.constitutive || ctrl.early || ctrl.mid || ctrl.mid_late || ctrl.late || ctrl.very_late) {
                            count++;
                        }

                        // no mutants to filter
                        if (count == 0) {
                            ctrl.tableParams.settings({dataset: ctrl.speciesGenes.keywordAll});
                            ctrl.loading = false;
                            return;
                        }

                        if (ctrl.constitutive || ctrl.early || ctrl.mid || ctrl.mid_late || ctrl.late || ctrl.very_late) {
                            // filter by gene expression timing
                            expressionTimingData.getExpression(function (data) {
                                var tags = [];
                                var timings = [];

                                if (ctrl.constitutive) {
                                    timings.push("Constitutive");
                                }
                                if (ctrl.early) {
                                    timings.push("Early");
                                }
                                if (ctrl.mid) {
                                    timings.push("Mid");
                                }
                                if (ctrl.mid_late) {
                                    timings.push("Mid_Late");
                                }
                                if (ctrl.late) {
                                    timings.push("Late");
                                }
                                if (ctrl.very_late) {
                                    timings.push("Very_Late");
                                }

                                angular.forEach(data, function (gene) {
                                    if (timings.indexOf(gene.RB_EXPRESSION_TIMING) != -1) {
                                        tags.push(gene["Locus tag"]);
                                    }
                                });

                                ctrl.speciesGenes.keywordAll = $filter('locusTagFilter')(ctrl.speciesGenes.keywordAll, tags);
                                count--;
                                if (count == 0) {
                                    ctrl.tableParams.settings({dataset: ctrl.speciesGenes.keywordAll});
                                    ctrl.loading = false;
                                    return;
                                }
                            });
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
                                ctrl.speciesGenes.keywordAll = $filter('locusTagFilter')(ctrl.speciesGenes.keywordAll, tags);
                                count--;
                                if (count == 0) {
                                    ctrl.tableParams.settings({dataset: ctrl.speciesGenes.keywordAll});
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
                                ctrl.speciesGenes.keywordAll = $filter('locusTagFilter')(ctrl.speciesGenes.keywordAll, tags);
                                count--;
                                if (count == 0) {
                                    ctrl.tableParams.settings({dataset: ctrl.speciesGenes.keywordAll});
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
                                ctrl.speciesGenes.keywordAll = $filter('locusTagFilter')(ctrl.speciesGenes.keywordAll, tags);
                                count--;
                                if (count == 0) {
                                    ctrl.tableParams.settings({dataset: ctrl.speciesGenes.keywordAll});
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
                                ctrl.speciesGenes.keywordAll = $filter('locusTagFilter')(ctrl.speciesGenes.keywordAll, tags);
                                count--;
                                if (count == 0) {
                                    ctrl.tableParams.settings({dataset: ctrl.speciesGenes.keywordAll});
                                    ctrl.loading = false;
                                    return;
                                }
                            });
                        }

                    });

                };

                if (ctrl.adv_cache) {
                    ctrl.advSearch();
                }
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
                        inner += queryBuilder.equals("?protein", "pdb", ctrl.pdb_text.toUpperCase());
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

                if (ctrl.rb) {
                    inner += queryBuilder.triple("?protein", "db", "wd:Q51955198");
                } else {
                    inner += queryBuilder.optional(queryBuilder.triple("?protein", "db", "wd:Q51955198"));
                }
                if (ctrl.eb) {
                    inner += queryBuilder.triple("?protein", "db", "wd:Q51955212");
                } else {
                    inner += queryBuilder.optional(queryBuilder.triple("?protein", "db", "wd:Q51955212"));
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

                if (ctrl.hp || ctrl.bacp) {
                    inner += queryBuilder.triple("?protein", "hp", "?host_protein");
                    inner += queryBuilder.addLabel("?protein", "hp", "?host_proteinLabel");
                } else {
                    inner += queryBuilder.optional(queryBuilder.triple("?protein", "hp", "?host_protein"));
                }
                if (ctrl.hp && ctrl.bacp) {

                } else if (ctrl.hp) {
                    inner += queryBuilder.minus(queryBuilder.triple("?host_protein", "taxon", "?taxon"));
                } else if (ctrl.bacp) {
                    inner += queryBuilder.triple("?host_protein", "taxon", "?taxon");
                }

                if (ctrl.uniprot || ctrl.refseq || ctrl.mf || ctrl.bp || ctrl.cc || ctrl.hp || ctrl.bacp ||
                    ctrl.pdb || ctrl.eb || ctrl.rb) {
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
                    query += queryBuilder.filter("?host_proteinLabel", ctrl.hp_text);
                }

                if (ctrl.bacp && ctrl.bacp_text) {
                    query += queryBuilder.filter("?host_proteinLabel", ctrl.bacp_text);
                }

                query += queryBuilder.ending();

                console.log("QUERY:");
                console.log(query);

                return query;

            };

        },
        templateUrl:
            '/static/build/js/angular_templates/advanced-search-page.min.html'
    }).factory('queryBuilder', function (appData) {

    var pMap = {
        entrez: 'wdt:P351',
        uniprot: 'wdt:P352',
        refseq: 'wdt:P637',
        mf: 'wdt:P680',
        cc: 'wdt:P681',
        bp: 'wdt:P682',
        protein: 'wdt:P688',
        hp: 'wdt:P129',
        pdb: 'wdt:P638',
        db: 'wdt:P5572',
        taxon: 'wdt:P703'
    };

    var optional = function (input) {
        return "OPTIONAL {" + input + "}\n";
    };

    var minus = function (input) {
        return "MINUS {" + input + "}\n";
    };

    var union = function (s1, s2) {
        return "{" + s1 + "} UNION {" + s2 + "}\n";
    };

    var filter = function (term, keyword) {
        return "FILTER(CONTAINS(LCASE(" + term + "), '" + keyword.toLowerCase() + "')).\n";
    };

    var equals = function (key, property, value) {
        return key + " " + pMap[property] + " '" + value + "'.\n";
    };

    var filterEnglish = function (keyword) {
        return "FILTER(LANG(" + keyword + ") = 'en').\n";
    };

    var parentTax = 0;
    appData.getAppData( function(data) {
        parentTax = data.parent_taxid;
    });

    var beginning = function () {
        return "SELECT ?taxon ?taxid ?taxonLabel ?geneLabel ?entrez ?uniprot ?proteinLabel ?locusTag ?refseq_prot ?gene ?pdb" +
            "(GROUP_CONCAT(DISTINCT ?aliases) AS ?aliases) (GROUP_CONCAT(DISTINCT ?mfLabel) AS ?mfLabel) (GROUP_CONCAT(DISTINCT ?host_proteinLabel) AS ?host_proteinLabel)" +
            "(GROUP_CONCAT(DISTINCT ?bpLabel) AS ?bpLabel) (GROUP_CONCAT(DISTINCT ?ccLabel) AS ?ccLabel) (GROUP_CONCAT(DISTINCT ?host_protein) AS ?host_protein) WHERE {\n" +
            "?taxon (wdt:P171*/wdt:P685) '" + parentTax + "'.\n" +
            "?gene (wdt:P279|wdt:P31) wd:Q7187.\n" +
            "?gene wdt:P703 ?taxon.\n" +
            "?gene wdt:P2393 ?locusTag.\n" +
            "?gene skos:altLabel ?aliases.\n";
    };

    var ending = function () {
        return "?taxon wdt:P685 ?taxid.\n" +
            "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }" +
            "}\n" +
            "GROUP BY ?locusTag ?taxon ?taxid ?taxonLabel ?geneLabel ?entrez ?uniprot ?proteinLabel ?refseq_prot ?gene ?pdb";
    };

    var addLabel = function (keyword, property, term) {
        return keyword + " " + pMap[property] + "/rdfs:label " + term + ".\n";
    };

    var triple = function (key, property, value) {
        return key + " " + pMap[property] + " " + value + ".\n";
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
        union: union,
        minus: minus

    };


});
