angular
    .module('genesKeyword')
    .component('genesKeyword', {
        controller: function ($location, $filter, allChlamOrgs, allChlamydiaGenes, searchBuilder) {
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
                        ctrl.facetOrganism = function (organism) {
                            ctrl.currentOrgsList = [];
                            angular.forEach(ctrl.orgData, function (value) {
                                if (value.check == true) {
                                    ctrl.currentOrgsList.push(value.taxid);
                                }
                            });
                            ctrl.chlamGenes.currentKW = $filter('deleteJsonItemValuesList')('taxid', ctrl.currentOrgsList, ctrl.chlamGenes.keywordAll);
                            console.log($filter('deleteJsonItemValuesList')('taxid', ctrl.currentOrgsList, ctrl.chlamGenes.keywordAll));
                        };
                    }).finally(function () {
                        ctrl.loading = false;
                    });
            };
        },
        templateUrl: '/static/wiki/js/angular_templates/genes-keyword-browser.html'
    }).factory('searchBuilder', function () {
    	
    	/*SELECT ?taxon ?taxid ?taxonLabel ?geneLabel ?entrez ?uniprot ?proteinLabel ?locusTag ?refseq_prot ?aliases ?goLabel ?host_protein WHERE {
  ?taxon wdt:P171* wd:Q846309.
  ?gene wdt:P279 wd:Q7187.
  ?gene wdt:P703 ?taxon.
  ?gene wdt:P351 ?entrez.
  ?gene wdt:P2393 ?locusTag.
  ?gene skos:altLabel ?aliases.
  OPTIONAL {
      ?gene wdt:P688 ?protein.
      ?protein wdt:P352 ?uniprot.
      ?protein wdt:P637 ?refseq_prot.
    
      OPTIONAL {
         ?protein (wdt:P680 | wdt:P681 | wdt:P682)* ?goTerm; rdfs:label ?goLabel.
      }
    
      OPTIONAL {
        ?protein wdt:P129 ?host_protein
      }
  }
  ?taxon wdt:P685 ?taxid.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}*/
    	
    	
    	
    	var buildQuery = function(binary_data, value_data) {
    		
    	};

        return {
            buildQuery: buildQuery
        };


    });
