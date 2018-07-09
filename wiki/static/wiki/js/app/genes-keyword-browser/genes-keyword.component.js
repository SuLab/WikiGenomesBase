angular
    .module('genesKeyword')
    .component('genesKeyword', {
        controller: function ($location, $filter, allChlamOrgs, allChlamydiaGenes, queryBuilder, $http) {
            'use strict';
            var ctrl = this;

            ctrl.$onInit = function () {
                ctrl.loading = true;
                ctrl.chlamGenes = {};
                ctrl.keyword = $location.path().split("/")[2];
                ctrl.orgData = [];
                allChlamOrgs.getAllOrgs(function (data) {
                    angular.forEach(data, function (value) {
                        value.check = true;
                        ctrl.orgData.push(value);
                    });
                });
                ctrl.getChlamGenes = allChlamydiaGenes.getAllChlamGenes().then(
                    function (data) {

                        ctrl.chlamGenes.allGenes = data.data.results.bindings;
                        ctrl.chlamGenes.keywordAll = $filter('keywordFilter')(ctrl.chlamGenes.allGenes, ctrl.keyword);
                        ctrl.chlamGenes.currentKW = ctrl.chlamGenes.keywordAll;
                        
                        console.log(ctrl.chlamGenes.currentKW);
                    }).finally(function () {
                        ctrl.loading = false;
                    });
            };
            
            ctrl.facetOrganism = function (organism) {
                ctrl.currentOrgsList = [];
                angular.forEach(ctrl.orgData, function (value) {
                    if (value.check == true) {
                        ctrl.currentOrgsList.push(value.taxid);
                    }
                });
                ctrl.chlamGenes.currentKW = $filter('deleteJsonItemValuesList')('taxid', ctrl.currentOrgsList, ctrl.chlamGenes.keywordAll);
            };
            
            ctrl.advSearch = function() {
            	ctrl.loading = true;
                var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
                var url = endpoint + encodeURIComponent(ctrl.buildQuery());
                $http.get(url).then(function(data) {
                	ctrl.chlamGenes.allGenes = data.data.results.bindings;
                    ctrl.chlamGenes.keywordAll = $filter('keywordFilter')(ctrl.chlamGenes.allGenes, ctrl.keyword);
                    ctrl.chlamGenes.currentKW = ctrl.chlamGenes.keywordAll;
                }).finally(function() {
                	ctrl.loading = false;
                });
            };
            
            ctrl.buildQuery = function() {
            	var query = queryBuilder.beginning();
            	
            	if (ctrl.entrez && ctrl.entrez_text) {
            		query += queryBuilder.equals("?gene", "entrez", ctrl.entrez_text);
            	} else {
            		query += queryBuilder.triple("?gene", "entrez", "?entrez");
            	}
            	
            	var inner = "";
            	
            	if (ctrl.uniprot) {
            		inner += queryBuilder.equals("?protein", "uniprot", ctrl.uniprot_text);
            	} else {
            		inner += queryBuilder.optional(queryBuilder.triple("?protein", "uniprot", "?uniprot"));
            	}
            	
            	if (ctrl.refseq) {
            		inner += queryBuilder.equals("?protein", "refseq", ctrl.refseq_text);
            	} else {
            		inner += queryBuilder.optional(queryBuilder.triple("?protein", "refseq", "?refseq"));
            	}
            	
            	if (ctrl.mf || ctrl.bp || ctrl.cc) {
            		inner += queryBuilder.goQuery(ctrl.mf, ctrl.cc, ctrl.bp);
            		inner += queryBuilder.filterEnglish('?goLabel');
            	} else {
            		inner = queryBuilder.goQuery(true, true, true);
            		inner += queryBuilder.filterEnglish('?goLabel');
            		inner = queryBuilder.optional(inner);
            	}
            	
            	if (ctrl.hp) {
            		inner += queryBuilder.addLabel("?protein", "hp", "?host_protein");
            	} else {
            		inner += queryBuilder.optional(queryBuilder.addLabel("?protein", "hp", "?host_protein"));
            	}
            	
            	if (ctrl.uniprot || ctrl.refseq || ctrl.mf || ctrl.bp || ctrl.cc || ctrl.hp) {
            		query += queryBuilder.triple("?gene", "protein", "?protein");
            		query += inner;
            	} else {
            		inner = queryBuilder.triple("?gene", "protein", "?protein") + inner;
            		query += queryBuilder.optional(inner);
            	}
            	
            	if (ctrl.uniprot && ctrl.uniprot_text) {
            		query += queryBuilder.filter("?uniprot", ctrl.uniprot_text);
            	}
            	
            	if (ctrl.refseq && ctrl.refseq_text) {
            		query += queryBuilder.filter("?refseq_prot", ctrl.refseq_text);
            	}
            	
            	if ((ctrl.mf && ctrl.mf_text) || (ctrl.cc && ctrl.cc_text) || (ctrl.bp && ctrl.bp_text)) {
            		query += queryBuilder.goFilter(ctrl.mf_text, ctrl.cc_text, ctrl.bp_text);
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
    			hp: 'wdt:P129'
    	};
    	
    	var optional = function(input) {
    		return "OPTIONAL {" + input + "}";
    	};
    	
    	var filter = function(term, keyword) {
    		return "FILTER(CONTAINS(" + term + ", '" + keyword + "')).";
    	};
    	
    	var goFilter = function(mf, cc, bp) {
    		var input = "";
    		if (mf) {
    			input = "CONTAINS(?goLabel, '" + mf + "')";
    		}
    		if (cc) {
    			if (input.length > 1) {
    				input += " || ";
    			}
    			input += "CONTAINS(?goLabel, '" + cc + "')";
    		}
    		if (bp) {
    			if (input.length > 1) {
    				input += " || ";
    			}
    			input += "CONTAINS(?goLabel, '" + bp + "')";
    		}
    		
    		return "FILTER("+input+").";
    	};
    	
    	var equals = function(key, property, value) {
    		return key + " " + pMap[property] + " '" + value + "'.";
    	};
    	
    	var filterEnglish = function(keyword) {
    		return "FILTER(LANG("+keyword+") = 'en').";
    	};
    	
    	var beginning = function() {
    		return "SELECT ?taxon ?taxid ?taxonLabel ?geneLabel ?entrez ?uniprot ?proteinLabel ?locusTag ?refseq_prot ?gene" +
                    "(GROUP_CONCAT(DISTINCT ?aliases) AS ?aliases) (GROUP_CONCAT(DISTINCT ?goLabel) AS ?goLabel) (GROUP_CONCAT(DISTINCT ?host_protein) AS ?host_protein) WHERE {" +
                    	"?taxon wdt:P171* wd:Q846309." +
                    	"?gene wdt:P279 wd:Q7187." +
                    	"?gene wdt:P703 ?taxon."+
                    	"?gene wdt:P2393 ?locusTag."+
                    	"?gene skos:altLabel ?aliases.";
    	};
    	
    	var ending = function() {
    		return "?taxon wdt:P685 ?taxid." +
        			"SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }" +
        			"}" +
        			"GROUP BY ?locusTag ?taxon ?taxid ?taxonLabel ?geneLabel ?entrez ?uniprot ?proteinLabel ?refseq_prot ?gene";
    	};
    	
    	var goQuery = function(mf, cc, bp) {
    		
    		var text = "(";
    		if (mf) {
    			text += "wdt:P680";
    		}
    		if (cc) {
    			if (text.length > 1) {
    				text += " | ";
    			}
    			text += "wdt:P681";
    		}
    		if (bp) {
    			if (text.length > 1) {
    				text += " | ";
    			}
    			text += "wdt:P682";
    		}
    		text += ")";
    		
    		return "?protein "+text+"+/rdfs:label ?goLabel.";
    	};
    	
    	var addLabel = function(keyword, property, term) {
    		return keyword + " " + pMap[property] + "/rdfs:label " + term + ".";
    	};
    	
    	var triple = function(key, property, value) {
    		return key + " " + pMap[property] + " " + value + ".";
    	};

        return {
            optional: optional,
            filter: filter,
            equals: equals,
            filterEnglish: filterEnglish,
            beginning: beginning,
            ending: ending,
            goQuery: goQuery,
            addLabel: addLabel,
            triple: triple,
            goFilter: goFilter
            
        };


    });
