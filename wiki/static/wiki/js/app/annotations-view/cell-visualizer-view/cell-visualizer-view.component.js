"use strict";

angular.module("cellVisualizer")

    .controller("cellVisualizerCtrl", function(geneOntologyService, $timeout) {

        var ctrl = this;
        
        this.status = "Loading Component Viewer...";

        // go values are loaded with a delay
        $timeout(function() {
            angular.forEach(ctrl.cellComp.go.cellcomp, function(value) {
                var id = (value.goID.value).replace(":", "_");
                ctrl.highlight(id);
            });
            ctrl.status = "No Components to Show";
        }, 2000);

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

        }

        function fill(goTerm) {
            var svg = document.getElementById("cell-svg");

            var svgDoc = svg.contentDocument;

            var paths = svgDoc.getElementsByClassName(geneOntologyService.getClass(goTerm));

            if (geneOntologyService.isPlasmaMembrane(goTerm)) {
                
                // fill outside  minus the inside
                paths[0].style.fill = "#4784FF";
                svgDoc.getElementsByClassName("cytoplasm")[0].style.fill = "#FFFFFF";

            } else {
                for (var i = 0; i < paths.length; i++) {
                    paths[i].style.fill = "#4784FF";
                }
            }

        }

    })
    .service("geneOntologyService", function($http, $q) {

        var go_map = {
            'GO_0005794' : 'golgi',
            'GO_0005768' : 'endosome',
            'GO_0005777' : 'peroxisome',
            'GO_0005634' : 'nucleus',
            'GO_0005739' : 'mitochondria',
            'GO_0005783' : 'er',
            'GO_0010168' : 'eb',
            'GO_0005764' : 'lysosome',
            'GO_0005811' : 'ld',
            'GO_0005813' : 'centrosome',
            'GO_0005856' : 'cytoskeleton',
            'GO_0005886' : 'plasma_membrane',
            'GO_0005737' : 'cytoplasm'
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
        }

        return {
            getParent : getParent,
            isValid : isValid,
            getClass : getClass,
            isPlasmaMembrane : isPlasmaMembrane
        }
    })
    .component("cellVisualizer", {
        controller : "cellVisualizerCtrl",
        templateUrl : "/static/wiki/js/angular_templates/cell-visualizer-view.html",
        bindings : {
            cellComp : "<"
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