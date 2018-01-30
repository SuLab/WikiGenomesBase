"use strict";

angular.module("cellVisualizer")

    .controller("cellVisualizerCtrl", function(geneOntologyService) {
        
        var ctrl = this;
        
        // go values are loaded with a delay
        setTimeout(function() {
            angular.forEach(ctrl.cellComp.go.cellcomp, function(value) {
                var id = (value.goID.value).replace(":", "_");
                makeBlue(id);
            });
        }, 2000);
        
        this.displayCell = false;

        function makeBlue(goTerm) {

            // get next parent that is valid
            if (!geneOntologyService.isValid(goTerm)) {
                geneOntologyService.getParent(goTerm).then(function(response) {
                    for (var i = 0; i < response._embedded.terms.length; i++) {
                        var term = response._embedded.terms[i];
                        if (geneOntologyService.isValid(term.short_form)) {
                            ctrl.displayCell = true;
                            fill(term.short_form);
                            return;
                        }
                    }
                    console.log("No compatible parent  found");
                    console.log(response);
                }, function(response) {
                    console.log(response);
                });
            } else {

                // fill the component immediately
                fill(goTerm);
            }

        }

        function fill(goTerm) {
            var svg = document.getElementById("cell-svg");

            var svgDoc = svg.contentDocument;

            var paths = svgDoc.getElementsByClassName(geneOntologyService.getClass(goTerm));

            for (var i = 0; i < paths.length; i++) {
                paths[i].style.fill = "#4784FF";
            }
        }

    })
    .service("geneOntologyService", function($http, $q) {

        var go_map = {
            'GO_0005794' : 'golgi',
            'GO_0005768' : 'endosome',
            'GO_0005777' : 'peroxisome'
        };

        var getParent = function(term) {

            var deferred = $q.defer();

            var url = 'https://www.ebi.ac.uk';
            var endpoint = '/ols/api/ontologies/go/terms/';
            var iri = encodeURIComponent(encodeURIComponent('http://purl.obolibrary.org/obo/' + term));

            $http.get(url + endpoint + iri + '/hierarchicalAncestors').success(function(data) {
                deferred.resolve(data);
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

        return {
            getParent : getParent,
            isValid : isValid,
            getClass : getClass
        }
    })
    .component("cellVisualizer", {
        controller : "cellVisualizerCtrl",
        templateUrl : "/static/wiki/js/angular_templates/cell-visualizer-view.html",
        bindings: {
            cellComp: "<"
        }
    });

    /*
    Peroxisome
    Cytoskeleton
    Actin
    Microtubules
    Cytosol
    Extracellular or secreted
    Plasma membrane
    Lipid droplet
    RB
    EB
    Inclusion
    Inclusion membrane
    Lysosome
    Endosome
    Mitochondria
    Centrosome
    Golgi
    ER
    */