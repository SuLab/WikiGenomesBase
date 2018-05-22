angular.module("cellVisualizer")

    .controller("cellVisualizerCtrl", function(geneOntologyService, $timeout) {
        'use strict';

        var ctrl = this;

        this.status = "Loading Component Viewer...";
        this.loading = true;

        function load() {
            if (ctrl.cellComp) {
                angular.forEach(ctrl.cellComp, function(value) {
                    var id = (value.goID.value).replace(":", "_");
                    ctrl.highlight(id);
                });
                ctrl.loading = false;
                ctrl.status = "No Components to Show";
            } else {
                $timeout(load, 1000);
            }
        }

        // go values are loaded with a delay
        $timeout(load, 1000);

        this.displayCell = false;

        this.highlight = function(goTerm) {

            // get next parent that is valid
            if (!geneOntologyService.isValid(goTerm)) {
                geneOntologyService.getParent(goTerm).then(function(response) {
                    ctrl.displayCell = true;
                    fill(response);
                }, function(response) {
                    console.log("No compatible parent  found for " + goTerm);
                    console.log(response);
                });
            } else {

                // fill the component immediately
                ctrl.displayCell = true;
                fill(goTerm);
            }

        };

        function fill(goTerm) {
            var svg = document.getElementById("cell-svg");

            var svgDoc = svg.contentDocument;
            
            var paths = [];
            
            if (geneOntologyService.isInclusion(goTerm)) {
                paths = svgDoc.getElementsByClassName("inclusion");
            } else {
                paths = svgDoc.getElementsByClassName(geneOntologyService.getClass(goTerm));
            }

            if (geneOntologyService.isPlasmaMembrane(goTerm)) {

                // fill outside  minus the inside
                paths[0].style.fill = "#4784FF";
                
                // subtract inside only if cytoplasm is not also filled
                if (svgDoc.getElementsByClassName("cytoplasm")[0].style.fill != "#4784FF") {
                    svgDoc.getElementsByClassName("cytoplasm")[0].style.fill = "#FFFFFF";
                }

            } else if (geneOntologyService.isInclusion(goTerm)) {
                if (geneOntologyService.isInclusionMembrane(goTerm)) {
                    paths[0].style.stroke = "#4784FF";
                } else {
                    paths[0].style.fill = "#4784FF";
                }
            } else {
                for (var i = 0; i < paths.length; i++) {
                    paths[i].style.fill = "#4784FF";
                }
            }
            
        }

    })
    .service("geneOntologyService", function($http, $q) {

        var go_map = {
            'GO_0044177' : 'golgi',
            'GO_0044174' : 'endosome',
            'GO_0120149' : 'peroxisome',
            'GO_0042025' : 'nucleus',
            'GO_0033650' : 'mitochondria',
            'GO_0044165' : 'er',
            'GO_0140221' : 'inclusion_membrane',
            'GO_0140222' : 'inclusion_lumen',
            'BTO_0001172' : 'rb',
            'BTO_0000377' : 'eb',
            'GO_0044187' : 'lysosome',
            'GO_0044186' : 'ld',
            'GO_0120148' : 'centrosome',
            'GO_0044163' : 'cytoskeleton',
            'GO_0020002' : 'plasma_membrane',
            'GO_0030430' : 'cytoplasm'
        };

        var getParent = function(term) {

            var deferred = $q.defer();

            var url = 'https://www.ebi.ac.uk';
            var endpoint = '/ols/api/ontologies/go/terms/';
            var iri = encodeURIComponent(encodeURIComponent('http://purl.obolibrary.org/obo/' + term));

            $http.get(url + endpoint + iri + '/hierarchicalAncestors').success(function(data) {

                for (var i = 0; i < data._embedded.terms.length; i++) {
                    var next = data._embedded.terms[i];
                    if (isValid(next.short_form)) {
                        console.log("Go term " + term + " has parent " + next.label);
                        deferred.resolve(next.short_form);
                        return;
                    }
                }

                deferred.reject(data);
            }).error(function(response) {
                deferred.reject(response);
            });

            return deferred.promise;

        };

        var getClass = function(goTerm) {
            return go_map[goTerm];
        };

        var isValid = function(goTerm) {
            return go_map[goTerm] ? true : false;
        };

        var isPlasmaMembrane = function(goTerm) {
            return go_map[goTerm] == 'plasma_membrane';
        };
        

        var isInclusion = function(goTerm) {
            return go_map[goTerm] == 'inclusion_membrane' || go_map[goTerm] == 'inclusion_lumen';
        };
        
        var isInclusionMembrane = function(goTerm) {
            return go_map[goTerm] == 'inclusion_membrane';
        };

        return {
            getParent : getParent,
            isValid : isValid,
            getClass : getClass,
            isPlasmaMembrane : isPlasmaMembrane,
            isInclusion : isInclusion,
            isInclusionMembrane: isInclusionMembrane
        };
    })
    .component("cellVisualizer", {
        controller : "cellVisualizerCtrl",
        templateUrl : "/static/wiki/js/angular_templates/cell-visualizer-view.html",
        bindings : {
            cellComp : "<"
        }
    });