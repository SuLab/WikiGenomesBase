"use strict";

angular.module("cellVisualizer")

    .controller("cellVisualizerCtrl", function($scope, geneOntologyService) {

        $scope.makeBlue = function() {

            // temp for testing
            var go_map = {
                'GO_0005794' : 'golgi',
                'GO_0005768' : 'endosome',
                'GO_0005777' : 'peroxisome'
            };

            angular.forEach(go_map, function(value, key) {
                if (geneOntologyService.isValid(key)) {

                    var svg = document.getElementById("cell-svg");

                    var svgDoc = svg.contentDocument;

                    var paths = svgDoc.getElementsByClassName(geneOntologyService.getClass(key));

                    for (var i = 0; i < paths.length; i++) {
                        paths[i].style.fill = "#4784FF";
                    }

                }
            });

            geneOntologyService.getParent("GO_0020015").then(function(response) {
                console.log(response.data);
            }, function(response) {
                console.log(response);
            });

        };

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
            var iri = encodeURIComponent('http://purl.obolibrary.org/obo/' + term);

            $http.get(url + endpoint + iri +'/hierarchicalAncestors').success(function(data) {
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
        templateUrl : "/static/wiki/js/angular_templates/cell-visualizer-view.html"
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