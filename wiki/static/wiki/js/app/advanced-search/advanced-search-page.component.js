angular
    .module('advSearchPage')
    .component('advSearchPage', {
        controller: function ($location, $filter, allSpeciesGenes, queryBuilder, $http, allGoTerms, sendToView, $cacheFactory, appData, NgTableParams, expressionTimingData, concatenator, $timeout) {
            'use strict';
            var ctrl = this;

            ctrl.$onInit = function () {
                ctrl.speciesGenes = {};

                ctrl.tableParams = new NgTableParams();

                ctrl.longTitle = function ($item) {
                    if ($item.length > 80) {
                        return $item;
                    } else {
                        return '';
                    }
                };

                ctrl.keyword = $location.path().split("/")[2];
                ctrl.keywordResult = ctrl.keyword;

                ctrl.adv_cache = $cacheFactory.get("advSearch");

                appData.getAppData(function (data) {
                    ctrl.appData = data;

                    ctrl.onSelect = function ($item) {
                        if (data.primary_identifier == "locus_tag") {
                            $location.path('/organism/' + $item.taxid.value + "/gene/" + $item.locusTag.value);
                        } else {
                            $location.path('/organism/' + $item.taxid.value + "/gene/" + $item.entrez.value);
                        }
                    };
                });

                ctrl.advSearch = function () {
                    ctrl.loading = true;
                    ctrl.storeCache();

                    ctrl.keywordResult = ctrl.keyword;

                    var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
                    appData.getAppData(function (data) {
                        var url = endpoint + encodeURIComponent(ctrl.buildQuery(data.parent_taxid));
                        $http.get(url).then(function (data) {
                            ctrl.speciesGenes.allGenes = concatenator.concatenate(data.data.results.bindings);
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
                            if (ctrl.constitutive || ctrl.early || ctrl.mid || ctrl.midlate || ctrl.late || ctrl.verylate) {
                                count++;
                            }

                            // no mutants to filter
                            if (count == 0) {
                                ctrl.tableParams.settings({dataset: ctrl.speciesGenes.keywordAll});
                                ctrl.loading = false;
                                return;
                            }

                            if (ctrl.constitutive || ctrl.early || ctrl.mid || ctrl.midlate || ctrl.late || ctrl.verylate) {
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
                                    if (ctrl.midlate) {
                                        timings.push("Mid_Late");
                                    }
                                    if (ctrl.late) {
                                        timings.push("Late");
                                    }
                                    if (ctrl.verylate) {
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

                        }, function (error) {
                            console.log("Error with query");
                            console.log(error);
                            ctrl.loading = false;
                        });
                    });

                };

                // need to wait for cache to be loaded in child then update in parent
                if (ctrl.adv_cache || ctrl.keyword != "") {
                    $timeout(ctrl.advSearch, 500);
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

            ctrl.buildQuery = function (parentTax) {

                var query = queryBuilder.beginning(parentTax);

                if (ctrl.appData.primary_identifier == "locus_tag") {
                    query += queryBuilder.triple("?gene", "locusTag", "?locusTag");
                }

                if (ctrl.entrez || ctrl.appData.primary_identifier == "entrez") {
                    if (ctrl.entreztext && ctrl.entrez) {
                        query += queryBuilder.equals("?gene", "entrez", ctrl.entreztext);
                    } else {
                        query += queryBuilder.triple("?gene", "entrez", "?entrez");
                    }
                }

                if (ctrl.operon) {
                    query += queryBuilder.triple("?gene", "partOf", "?operon");
                    if (ctrl.operontext) {
                        query += queryBuilder.triple("?operon", "hasPart", "?operonGenes");
                        query += queryBuilder.triple("?operonGenes", "locusTag", "?opLocusTags");
                        query += queryBuilder.filter("?opLocusTags", ctrl.operontext);
                    }
                }

                var inner = "";

                if (ctrl.uniprot) {
                    if (ctrl.uniprottext) {
                        inner += queryBuilder.equals("?protein", "uniprot", ctrl.uniprottext);
                    } else {
                        inner += queryBuilder.triple("?protein", "uniprot", "?uniprot");
                    }
                }

                if (ctrl.pdb) {
                    if (ctrl.pdbtext) {
                        inner += queryBuilder.equals("?protein", "pdb", ctrl.pdbtext.toUpperCase());
                    } else {
                        inner += queryBuilder.triple("?protein", "pdb", "?pdb");
                    }
                }

                if (ctrl.refseq) {
                    if (ctrl.refseqtext) {
                        inner += queryBuilder.equals("?protein", "refseq", ctrl.refseqtext);
                    } else {
                        inner += queryBuilder.triple("?protein", "refseq", "?refseq");
                    }

                }

                if (ctrl.rb) {
                    inner += queryBuilder.triple("?protein", "db", "wd:Q51955198");
                }
                if (ctrl.eb) {
                    inner += queryBuilder.triple("?protein", "db", "wd:Q51955212");
                }

                if (ctrl.mf) {
                    inner += queryBuilder.addLabel("?protein", "mf", "?mfLabel");
                    inner += queryBuilder.filterEnglish('?mfLabel');
                }

                if (ctrl.bp) {
                    inner += queryBuilder.addLabel("?protein", "bp", "?bpLabel");
                    inner += queryBuilder.filterEnglish('?bpLabel');
                }

                if (ctrl.cc) {
                    inner += queryBuilder.addLabel("?protein", "cc", "?ccLabel");
                    inner += queryBuilder.filterEnglish('?ccLabel');
                }

                if (ctrl.hp || ctrl.bacp) {
                    inner += queryBuilder.triple("?protein", "hp", "?host_protein");
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
                }
                /*else {
                                   inner = queryBuilder.triple("?gene", "protein", "?protein") + inner;
                                   query += queryBuilder.optional(inner);
                               }*/

                if (ctrl.mf && ctrl.mftext) {
                    query += queryBuilder.filter("?mfLabel", ctrl.mftext);
                }

                if (ctrl.cc && ctrl.cctext) {
                    query += queryBuilder.filter("?ccLabel", ctrl.cctext);
                }

                if (ctrl.bp && ctrl.bptext) {
                    query += queryBuilder.filter("?bpLabel", ctrl.bptext);
                }

                if (ctrl.hp && ctrl.hptext) {
                    query += queryBuilder.filter("?host_proteinLabel", ctrl.hptext);
                }

                if (ctrl.bacp && ctrl.bacptext) {
                    query += queryBuilder.filter("?host_proteinLabel", ctrl.bacptext);
                }

                query += queryBuilder.ending();

                console.log("QUERY:");
                console.log(query);

                return query;

            };

        },
        templateUrl:
            '/static/build/js/angular_templates/advanced-search-page.min.html'
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
        pdb: 'wdt:P638',
        db: 'wdt:P5572',
        taxon: 'wdt:P703',
        locusTag: 'wdt:P2393',
        partOf: 'wdt:P361',
        hasPart: 'wdt:P527'
    };

    var optional = function (input) {
        return "OPTIONAL {\n" + input + "}\n";
    };

    var minus = function (input) {
        return "MINUS {\n" + input + "}\n";
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

    var beginning = function (parentTax) {
        return "SELECT REDUCED ?taxid ?taxonLabel ?gene ?geneLabel ?geneAltLabel ?locusTag " +
            "?entrez ?uniprot ?refseq_prot ?pdb ?mfLabel ?bpLabel ?ccLabel ?host_proteinLabel WHERE {\n" +
            "?taxon (wdt:P171*/wdt:P685) '" + parentTax + "';\n" +
            "   wdt:P685 ?taxid.\n" +
            "?gene wdt:P703 ?taxon;\n" +
            "   (wdt:P279|wdt:P31) wd:Q7187.\n";
    };

    var ending = function () {
        return "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }}";
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


}).factory('concatenator', function () {

    var concatenate = function (list) {
        var set = {};
        angular.forEach(list, function (entry) {
            // combine
            var locusTag = entry.locusTag.value;
            if (locusTag in set) {

                if ("mfLabel" in set[locusTag] && set[locusTag].mfLabel.value.indexOf(entry.mfLabel.value) == -1) {
                    set[locusTag].mfLabel.value.push(entry.mfLabel.value);
                }
                if ("bpLabel" in set[locusTag] && set[locusTag].bpLabel.value.indexOf(entry.bpLabel.value) == -1) {
                    set[locusTag].bpLabel.value.push(entry.bpLabel.value);
                }
                if ("ccLabel" in set[locusTag] && set[locusTag].ccLabel.value.indexOf(entry.ccLabel.value) == -1) {
                    set[locusTag].ccLabel.value.push(entry.ccLabel.value);
                }
                if ("host_proteinLabel" in set[locusTag] && set[locusTag].host_proteinLabel.value.indexOf(entry.host_proteinLabel.value) == -1) {
                    set[locusTag].host_proteinLabel.value.push(entry.host_proteinLabel.value);
                }
                if ("pdb" in set[locusTag] && set[locusTag].pdb.value.indexOf(entry.pdb.value) == -1) {
                    set[locusTag].pdb.value.push(entry.pdb.value);
                }
            }
            else {
                if ("mfLabel" in entry) entry.mfLabel.value = [entry.mfLabel.value];
                if ("bpLabel" in entry) entry.bpLabel.value = [entry.bpLabel.value];
                if ("ccLabel" in entry) entry.ccLabel.value = [entry.ccLabel.value];
                if ("host_proteinLabel" in entry) entry.host_proteinLabel.value = [entry.host_proteinLabel.value];
                if ("pdb" in entry) entry.pdb.value = [entry.pdb.value];
                set[locusTag] = entry;
            }
        });
        var updated = [];
        angular.forEach(set, function (entry) {
            if ("mfLabel" in entry) entry.mfLabel.value = entry.mfLabel.value.join(", ");
            if ("bpLabel" in entry) entry.bpLabel.value = entry.bpLabel.value.join(", ");
            if ("ccLabel" in entry) entry.ccLabel.value = entry.ccLabel.value.join(", ");
            if ("host_proteinLabel" in entry) entry.host_proteinLabel.value = entry.host_proteinLabel.value.join(", ");
            if ("pdb" in entry) entry.pdb.value = entry.pdb.value.join(", ");
            updated.push(entry);
        });
        return updated;
    };

    return {
        concatenate: concatenate
    };
});
