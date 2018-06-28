angular
    .module('goForm')
    .component('goForm', {
        controller: function ($routeParams, $filter, $location, evidenceCodes, sendToView, pubMedData, allGoTerms, locusTag2QID, orthoData) {
            var ctrl = this;
            
            ctrl.currentTaxid = $routeParams.taxid;
            ctrl.currentLocusTag = $routeParams.locusTag;
            ctrl.pageCount = 0;
            	
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
        	
            ctrl.goFormModel = {
                    evi: null,
                    pub: null,
                    go: null,
                    proteinQID: null,
                    goClass: goClassMap[ctrl.goclass].QID
            };
            
            // data collection for form query sets
            evidenceCodes.getevidenceCodes(function (data) {
                ctrl.evidence = data;
            });

            ctrl.data = {};
            ctrl.projection = {};
            orthoData.getOrthologs(ctrl.currentLocusTag).then(function(response) {

                // now add results from sparql query
                angular.forEach(response.results.bindings, function(obj) {
                    var tax = obj.orthoTaxid.value;
                    var tag = obj.orthoLocusTag.value;
                    ctrl.projection[tax] = false;
                    ctrl.data[tax] = tag;
                });

            });
            
            // for selecting from the check list
            ctrl.select = function(checked, value) {
                ctrl.projection[value] = checked;
            };
            
            // controls for navigating form
            ctrl.nextClick = function () {
                ctrl.pageCount += 1;
            };
            ctrl.backClick = function () {
                ctrl.pageCount -= 1;
            };
            
            ctrl.selectGoTerm = function ($item, $model, $label) {
                ctrl.goFormModel.go = $item;
                ctrl.goValue = '';
            };

            ctrl.selectPub = function ($item, $model, $label) {
                ctrl.goFormModel.pub = $item;
                ctrl.pubValue = '';
            };
            
            ctrl.getGoTermsAll = function (val) {
                ctrl.goTermLoading = true;
                return allGoTerms.getGoTermsAll(val, goClassMap[ctrl.goclass].QID).then(
                    function (data) {
                        return data.data.results.bindings.map(function (item) {
                            return item;
                        });
                    }).finally(function(){
                        ctrl.goTermLoading = false;
                    }
                );
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
            
            ctrl.resetForm = function () {
                ctrl.pageCount = 0;
                ctrl.goFormModel.evi = null;
                ctrl.goFormModel.pub = null;
                ctrl.goFormModel.go = null;
            };
            
            // form validation, must be true to allow submission
            ctrl.validateFields = function () {
                if (ctrl.goFormModel.evi && ctrl.goFormModel.pub && ctrl.goFormModel.go) {
                    return true;
                }
            };
            
            // send form data to server to edit wikidata
            ctrl.sendData = function () {
                ctrl.loading = true;
                
                var index = 0;
                var success = true;
                var authorize = false;
                
                console.log(ctrl.projection);
                angular.forEach(ctrl.projection, function(value, key) {
                	console.log(value);
                	if (value) {
                        locusTag2QID.getLocusTag2QID(ctrl.data[key], key).then(function (data) {
                        	
                            var formData = {
                                    evi: ctrl.goFormModel.evi,
                                    pub: ctrl.goFormModel.pub,
                                    go: ctrl.goFormModel.go,
                                    proteinQID: null,
                                    goClass: ctrl.goFormModel.goClass
                            };

                            ctrl.geneQID = $filter('parseQID')(data.data.results.bindings[0].gene.value);
                            if (data.data.results.bindings[0].protein) {
                                formData.proteinQID = $filter('parseQID')(data.data.results.bindings[0].protein.value);
                            } 
                            
                            var url_suf = '/organism/' + key + '/gene/' + ctrl.data[key] +  '/wd_go_edit';
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
                                    	console.log(data);
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
                            	console.log(data);
                                alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                    		} else {
                    			alert("Something went wrong.  Give it another shot!");
                    		}
                    		
                    		ctrl.loading = false;
                    	}
                	}
                });
                
            };
            
        },
        templateUrl: '/static/wiki/js/angular_templates/guided-go-form.html',
        bindings: {
            goclass: '<',
            gene: '<'
        }

    });




