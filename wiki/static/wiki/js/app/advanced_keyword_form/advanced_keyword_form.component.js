angular
    .module('advancedKeywordForm')
    .component('advancedKeywordForm', {
        controller: function ($cacheFactory, allGoTerms, $location, allChlamydiaGenes) {
        	var ctrl = this;
        	
            var goClassMap = {
                    'mf_button': {
                        name: 'Molecular Function',
                        QID: 'Q14860489'
                    },
                    'cc_button': {
                        name: 'Cellular Component',
                        QID: 'Q5058355'
                    },
                    'bp_button': {
                        name: 'Biological Process',
                        QID: 'Q2996394'
                    }
            };
        	
        	ctrl.mfTerms = function (val) {
                return allGoTerms.getGoTermsAll(val, goClassMap.mf_button.QID).then(function (data) {
                        return data.data.results.bindings.map(function (item) {
                            return item;
                        });
                    });
            };
            
            ctrl.ccTerms = function (val) {
                return allGoTerms.getGoTermsAll(val, goClassMap.cc_button.QID).then(function (data) {
                        return data.data.results.bindings.map(function (item) {
                            return item;
                        });
                    });
            };
            
            ctrl.bpTerms = function (val) {
                return allGoTerms.getGoTermsAll(val, goClassMap.bp_button.QID).then(function (data) {
                        return data.data.results.bindings.map(function (item) {
                            return item;
                        });
                    });
            };
            
            ctrl.advSearch = function() {
            	var cache = $cacheFactory('advSearch');
            	
            	cache.put("mf", [ctrl.mf, ctrl.mf_text]);
            	cache.put("bp", [ctrl.bp, ctrl.bp_text]);
            	cache.put("cc", [ctrl.cc, ctrl.cc_text]);
            	cache.put("hp", [ctrl.hp, ctrl.hp_text]);
            	cache.put("entrez", [ctrl.entrez, ctrl.entrez_text]);
            	cache.put("uniprot", [ctrl.uniprot, ctrl.uniprot_text]);
            	cache.put("refseq", [ctrl.refseq, ctrl.refseq_text]);
            	cache.put("cm", ctrl.cm);
            	cache.put("tm", ctrl.tm);
            	cache.put("im", ctrl.im);
            	cache.put("rm", ctrl.rm);
            	
            	if (!ctrl.keyword) {
            		ctrl.keyword = "";
            	}
            	
            	$location.path('keyword/' + ctrl.keyword);
            };
            
            allChlamydiaGenes.getAllChlamGeneLabels().then(function(data) {
        		ctrl.genes = data.data.results.bindings;
        	});
            
            ctrl.submitKeyword = function ($item) {
                if ($item == undefined){
                	$location.path('keyword/');
                } else{
                    $location.path('keyword/' + $item);
                }
            };
            
            ctrl.onSelect = function ($item) {
                $location.path('/organism/' + $item.taxid.value + "/gene/" + $item.locusTag.value);
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
        templateUrl: '/static/build/js/angular_templates/advanced-keyword-form.min.html'
    });