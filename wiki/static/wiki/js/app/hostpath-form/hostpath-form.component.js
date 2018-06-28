angular
    .module('hostpathForm')
    .component('hostpathForm', {
        bindings: {
            data: '<'
        },
        controller: function ($location, $routeParams, speciesGenes, pubMedData, sendToView, locusTag2QID, $filter, orthoData) {
            'use strict';
            var ctrl = this;
            
            ctrl.currentTaxid = $routeParams.taxid;
            ctrl.currentLocusTag = $routeParams.locusTag; 
            ctrl.pageCount = 0;
            
            ctrl.orthoData = {};
            ctrl.projection = {};
            orthoData.getOrthologs(ctrl.currentLocusTag).then(function(response) {

                // now add results from sparql query
                angular.forEach(response.results.bindings, function(obj) {
                    var tax = obj.orthoTaxid.value;
                    var tag = obj.orthoLocusTag.value;
                    ctrl.projection[tax] = false;
                    ctrl.orthoData[tax] = tag;
                });

            });
            
            // for selecting from the check list
            ctrl.select = function(checked, value) {
                ctrl.projection[value] = checked;
            };

            ctrl.nextClick = function () {
                ctrl.pageCount += 1;
            };

            ctrl.backClick = function () {
                ctrl.pageCount -= 1;
            };

            ctrl.hostpathAnnotation = {
                proteinQID: null,
                host_species: null,
                pub: null,
                host_protein: null,
                determination: null,
            };

            ctrl.species = [
                {
                    name: 'Homo sapiens',
                    qid: 'Q15978631',
                    taxid: '9606'
                },
                {
                    name: 'Mus musculus',
                    qid: 'Q83310',
                    taxid: '10090'
                }
            ];

            ctrl.determination_methods = [{
                "item": "https://www.wikidata.org/entity/Q32860428",
                "itemLabel": "immunoprecipitation evidence",
                "eco": "ECO:0000085"
            }, {
                "item": "https://www.wikidata.org/entity/Q32860432",
                "itemLabel": "co-localization evidence",
                "eco": "ECO:0001026"
            }];

            ctrl.getSpeciesGenes = function () {
                var taxid = ctrl.hostpathAnnotation.host_species.taxid;
                speciesGenes.getSpeciesGenes(taxid)
                    .then(function (data) {
                        ctrl.speciesGenes = data.data.results.bindings;
                    });
            };
            ctrl.selectProtein = function ($item, $model, $value) {
                ctrl.hostpathAnnotation.host_protein = $item;
            };

            ctrl.getPMID = function (val) {
                return pubMedData.getPMID(val).then(
                    function (data) {
                        var resultData = [data.data.result[val]];
                        return resultData.map(function (item) {
                            return item;
                        });
                    }
                );
            };
            ctrl.selectPub = function ($item, $model, $label) {
                ctrl.pubValue = $item;
            };
            
            // send form data to server to edit wikidata
            ctrl.sendData = function () {
                ctrl.loading = true;
                
                var index = 0;
                var success = true;
                var authorize = false;
                
                if (!$location.path().includes("authorized")) {
                    alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                    ctrl.loading = false;
                    return;
                }
                
                angular.forEach(ctrl.projection, function(value, key) {
                	if (value) {
                        locusTag2QID.getLocusTag2QID(ctrl.orthoData[key], key).then(function (data) {
                        	
                            var formData = {
                            		proteinQID: null,
                                    host_species: ctrl.hostpathAnnotation.host_species,
                                    pub: ctrl.hostpathAnnotation.pub,
                                    host_protein: ctrl.hostpathAnnotation.host_protein,
                                    determination: ctrl.hostpathAnnotation.determination
                            };
                            
                            if (data.data.results.bindings[0].protein) {
                                formData.proteinQID = $filter('parseQID')(data.data.results.bindings[0].protein.value);
                            }
                            
                            if (formData.proteinQID == null) {
                                return;
                            }
                            
                            var url_suf = '/organism/' + key + '/gene/' + ctrl.orthoData[key] +  '/wd_hostpath_edit';
                            
                            console.log(url_suf);
                            sendToView.sendToView(url_suf, formData).then(function (data) {
                                if (data.data.authentication === false){
                                    authorize = true;
                                    success = false;
                                }
                                else if (!data.data.write_success){
                                    success = false;
                                }
                            }).finally(function () {
                            	index++;
                            	
                            	if (index == Object.keys(ctrl.projection).length) {
                            		if (success) {
                            			alert("Successfully Annotated! Well Done! The annotation will appear here in a few minutes.");
                            			ctrl.resetForm();
                            		} else if (authorize) {
                            			console.log("FAILURE: AUTHENTICATION");
                                        alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                            		} else {
                            			alert("Something went wrong.  Give it another shot!");
                            		}
                            		
                            		ctrl.loading = false;
                            	}
                            });

                        });
                	} else {
                		index++;
                		
                    	if (index == Object.keys(ctrl.projection).length) {
                    		if (success) {
                    			alert("Successfully Annotated! Well Done! The annotation will appear here in a few minutes.");
                    			ctrl.resetForm();
                    		} else if (authorize) {
                    			console.log("FAILURE: AUTHENTICATION");
                                alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                    		} else {
                    			alert("Something went wrong.  Give it another shot!");
                    		}
                    		
                    		ctrl.loading = false;
                    	}
                	}
                });
                
            };
            
            ctrl.resetForm = function () {
                ctrl.pageCount = 0;
                ctrl.hostpathAnnotation = {
                	proteinQID: null,
                    host_species: null
                };

            };
        },


        templateUrl: '/static/wiki/js/angular_templates/hostpath-form.html'
    });


