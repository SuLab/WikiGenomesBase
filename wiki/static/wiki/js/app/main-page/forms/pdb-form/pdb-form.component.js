angular
    .module('pdbForm')
    .component('pdbForm', {
        controller: function (pubMedData, $location, orthoDataByEntrez, orthoDataByLocusTag, appData, locusTag2QID, entrez2QID, $filter, sendToView, taxidFilter, $routeParams) {
            'use strict';
            var ctrl = this;

            taxidFilter.map().then(function(data) {
                ctrl.tax2Name = data;
            });
            
            ctrl.$onInit = function () {
            	
                ctrl.pdbAnnotation = {
                    id: null,
                    pub: null,
                    qid: ctrl.gene.proteinQID,
                    image: null
                };

                // controls for navigating form
                ctrl.pageCount = 0;
                ctrl.nextClick = function () {
                    ctrl.pageCount += 1;
                };
                ctrl.backClick = function () {
                    ctrl.pageCount -= 1;
                };
                
                ctrl.orthoData = {};
                ctrl.projection = {};
                appData.getAppData(function (data) {

                    ctrl.appData = data;

                    var factory = orthoDataByLocusTag;

                    if (data.primary_identifier == "entrez") {
                        factory = orthoDataByEntrez;
                    }
                    factory.getOrthologs($routeParams.locusTag).then(function (response) {

                        // now add results from sparql query
                        angular.forEach(response.results.bindings, function (obj) {
                            var tax = obj.orthoTaxid.value;
                            var tag;
                            if (data.primary_identifier == "entrez") {
                                tag = obj.entrez.value;
                            } else {
                                tag = obj.orthoLocusTag.value;
                            }
                            ctrl.projection[tax] = tag == $routeParams.locusTag;
                            ctrl.orthoData[tax] = tag;
                        });

                    });
                });

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
                    ctrl.pdbAnnotation.pub = $item;
                };

                // form validation, must be true to allow submission
                ctrl.validateId = function () {
                    return ctrl.pdbAnnotation.id && ctrl.pdbAnnotation.id.length == 4 &&
                    		ctrl.pdbAnnotation.id.match(/[0-9][0-9A-Za-z]{3}/).length == 1;
                };

                // send form data to server to edit wikidata
                ctrl.sendData = function () {
                    ctrl.loading = true;
                    
                    var index = 0;
                    var success = true;
                    var authorize = false;
                    
                    var atleastone = false;
                    angular.forEach(ctrl.projection, function(value) {
                    	if (value == true) {
                    		atleastone = true;
                    	}
                    });
                    
                    if (!atleastone) {
                    	alert('Please select at least one gene to annotate!');
                    	ctrl.loading = false;
                        return;
                    }
                    
                    angular.forEach(ctrl.projection, function(value, key) {

                        var factory = locusTag2QID;
                        if (ctrl.appData.primary_identifier == "entrez"){
                            factory = entrez2QID;
                        }

                    	if (value) {
                            factory.getQID(ctrl.orthoData[key], key).then(function (data) {
                            	
                                var formData = {
                                		id: ctrl.pdbAnnotation.id.toUpperCase(),
                                        pub: ctrl.pdbAnnotation.pub.uid,
                                        qid: null,
                                        image: {
                                        	'front': "https://www.ebi.ac.uk/pdbe/static/entry/{}_deposited_chain_front_image-800x800.png".replace("{}", ctrl.pdbAnnotation.id),
                                        	'side': "https://www.ebi.ac.uk/pdbe/static/entry/{}_deposited_chain_side_image-800x800.png".replace("{}", ctrl.pdbAnnotation.id),
                                        	'top': "https://www.ebi.ac.uk/pdbe/static/entry/{}_deposited_chain_top_image-800x800.png".replace("{}", ctrl.pdbAnnotation.id)
                                        }
                                };
                                
                                if (data.data.results.bindings[0].protein) {
                                    formData.qid = $filter('parseQID')(data.data.results.bindings[0].protein.value);
                                }
                                
                                if (formData.qid == null) {
                                    return;
                                }
                                
                                var url_suf = '/organism/' + key + '/gene/' + ctrl.orthoData[key] +  '/wd_pdb_edit';
                                
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
                    ctrl.pdbAnnotation.id = null;
                    ctrl.pubValue = '';
                    ctrl.pdbAnnotation.pub = null;
                    ctrl.image = null;
                };

            };

        },
        templateUrl: '/static/build/js/angular_templates/pdb-form.min.html',
        bindings: {
            gene: '<'
        }
    });
