angular
    .module('localizationForm')
    .component('localizationForm', {
        controller: function ($location, $routeParams, pubMedData, sendToView, locusTag2QID, orthoData, $filter) {
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
                    ctrl.projection[tax] = tag == ctrl.currentLocusTag;
                    ctrl.orthoData[tax] = tag;
                });

            });

            ctrl.nextClick = function () {
                ctrl.pageCount += 1;
            };

            ctrl.backClick = function () {
                ctrl.pageCount -= 1;
            };

            ctrl.localizationAnnotation = {
                proteinQID: null,
                pub: null,
                localizationQID: null
            };

            ctrl.map = [
                {
                    name: 'elementary body',
                    qid: ['Q51955212'],
                },
                {
                    name: 'reticulate body',
                    qid: ['Q51955198'],
                },
                {
                	name: 'elementary body AND reticulate body',
                	qid: ['Q51955212', 'Q51955198']
                }
            ];

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
                
                if (!$location.path().includes("authorized")) {
                    alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                    ctrl.loading = false;
                    return;
                }
                
                angular.forEach(ctrl.projection, function(value, key) {
                	if (value) {
                        locusTag2QID.getLocusTag2QID(ctrl.orthoData[key], key).then(function (data) {
                        	
                        	angular.forEach(ctrl.localizationAnnotation.localizationQID.qid, function(qid) {
                        		var formData = {
                                		proteinQID: null,
                                        pub: ctrl.pubValue.uid,
                                        localizationQID: qid
                                };
                                
                                if (data.data.results.bindings[0].protein) {
                                    formData.proteinQID = $filter('parseQID')(data.data.results.bindings[0].protein.value);
                                }
                                
                                if (formData.proteinQID == null) {
                                    return;
                                }
                                
                                var url_suf = '/organism/' + key + '/gene/' + ctrl.orthoData[key] +  '/wd_localization_edit';
                                
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
                ctrl.pubValue = null;
                ctrl.localizationAnnotation = {
                        proteinQID: null,
                        pub: null,
                        localizationQID: null
                };

            };
        },


        templateUrl: '/static/build/js/angular_templates/localization-form.min.html'
    });


