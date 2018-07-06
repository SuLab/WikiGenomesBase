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
