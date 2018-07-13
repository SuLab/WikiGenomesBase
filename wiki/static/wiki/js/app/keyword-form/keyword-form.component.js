angular
    .module('keywordForm')
    .component('keywordForm', {
        controller: function ($filter, $location, allChlamydiaGenes) {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function(){
            	
            	ctrl.selected = null;
            	
            	allChlamydiaGenes.getAllChlamGeneLabels().then(function(data) {
            		ctrl.genes = data.data.results.bindings;
            		var pattern = /(TC|CTL|CT|CPn)_?(RS)?\d+/;
            		angular.forEach(ctrl.genes, function(gene) {
            			var value = gene.geneLabel.value;
            			var locusTag = value.match(pattern)[0];
            			
            			// add locus without _
            			if (value.indexOf("_") != -1) {
            				gene.geneLabel.value += "/" + locusTag.replace("_", "");
            			}
            			
            			// add locus without beginning 0s in number
            			var prefix = locusTag.match(/(TC|CTL|CT|CPn)_?(RS)?/)[0];
            			var num = parseInt(locusTag.substring(prefix.length));
            			gene.geneLabel.value += "/" + prefix + num;
            			
            			if (prefix.indexOf("_") != -1) {
            				gene.geneLabel.value += "/" + prefix.replace("_", "") + num;
            			}
            		});
            	});
            	
                ctrl.submitKeyword = function ($item) {
                    if ($item == undefined){
                        alert("Please enter a keyword or ID");
                    } else{
                        $location.path('keyword/' + $item);
                    }
                };
                
                ctrl.onSelect = function ($item) {
                    $location.path('/organism/' + $item.taxid.value + "/gene/" + $item.locusTag.value);
                };
            };
            
            // whether or not user has scrolled through dropdown
            ctrl.scrolled = false;
            
            ctrl.keyPressed = function($event) {
            	
            	// remove / from keyword
            	ctrl.keyword = ctrl.keyword.replace("/", " ");
            	
            	// ENTER is pressed
            	if ($event.keyCode == 13){ 
            		
            		// if user has scrolled, select that item
            		if (ctrl.scrolled) {
            			ctrl.onSelect(ctrl.selected);
            		
            		// else go to advanced search
            		} else {
            			ctrl.submitKeyword(ctrl.keyword);
            		}
            		
            		// any of the arrowkeys pressed
            	} else if ($event.keyCode >=37 && $event.keyCode <= 40) {
            		ctrl.scrolled = true;
            	}
            	
            };
            
            ctrl.select = function($item, $event) {
            	ctrl.selected = $item; 
            	if ($event.type == 'click') {
            		ctrl.onSelect($item);
            	}
            };

        },
        templateUrl: '/static/build/js/angular_templates/keyword-form.min.html'
    });
