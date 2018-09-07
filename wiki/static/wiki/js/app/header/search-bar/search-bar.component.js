angular
    .module('keywordForm')
    .component('keywordForm', {
        controller: function ($filter, $location, allSpeciesGenes, appData) {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function(){
            	
            	ctrl.selected = null;

                appData.getAppData(function(data) {
                    allSpeciesGenes.getAllSpeciesGeneLabels(data.parent_taxid).then(function(data) {
                        ctrl.genes = data.data.results.bindings;
                    });
                    ctrl.locusTag = data.example_locus_tag;

                    ctrl.onSelect = function ($item) {
                        if (data.primary_identifier == "locus_tag") {
                            $location.path('/organism/' + $item.taxid.value + "/gene/" + $item.locusTag.value);
                        } else {
                            $location.path('/organism/' + $item.taxid.value + "/gene/" + $item.entrez.value);
                        }
                    };
                });
            	
                ctrl.submitKeyword = function ($item) {
                    if ($item == undefined){
                    	$location.path('keyword/');
                    } else{
                        $location.path('keyword/' + $item);
                    }
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
            		
            		// or if there is only 1 item in the dropdown
            		} else if(ctrl.geneList && ctrl.geneList.length == 1){
            			ctrl.onSelect(ctrl.geneList[0]);
            		}
            		//else go to advanced search
            		else {
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
        templateUrl: '/static/build/js/angular_templates/search-bar.min.html'
    });
