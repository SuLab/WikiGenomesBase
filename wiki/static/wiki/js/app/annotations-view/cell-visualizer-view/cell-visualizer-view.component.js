"use strict";

angular.module("cellVisualizer")

.controller("cellVisualizerCtrl", function($scope) {
    
    $scope.makeBlue = function () {
        
        var svg = document.getElementById("cell-svg");
        
        var svgDoc = svg.contentDocument;
        
        var paths = svgDoc.getElementsByClassName("golgi");
        
        for (var i = 0; i < paths.length; i++) {
            paths[i].style.fill = "#4784FF";
        }
        
    };
	
})
.component("cellVisualizer", {
   controller: "cellVisualizerCtrl",
   templateUrl: "/static/wiki/js/angular_templates/cell-visualizer-view.html"
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