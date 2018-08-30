angular
    .module('operonForm')
    .component('operonForm', {
        controller: function ($routeParams, $location, $filter, pubMedData, locusTag2QID, allOrgOperons,
                              sendToView, tax2QID, taxidFilter) {
            'use strict';
            var ctrl = this;
            
            ctrl.currentTaxid = $routeParams.taxid;
            ctrl.currentLocusTag = $routeParams.locusTag;

            ctrl.opFormModel = {
                    name: null,
                    pub: [],
                    genes: [],
                    geneQID: ctrl.gene.geneQID,
                    taxid: ctrl.currentTaxid,
                    taxQID: null,
                    strand: null
                };

            taxidFilter.name(ctrl.currentTaxid).then(function (data) {
                ctrl.opFormModel.taxLabel = data;
            });
            
            ctrl.$onChanges = function() {
            	if (ctrl.strand) {
            		ctrl.opFormModel.strand = ctrl.strand;
            	}
            };
            
            ctrl.$onInit = function () {
                ctrl.alerts = {
                    'success': false,
                    'error': false
                };
                
                tax2QID.getQID(ctrl.currentTaxid).then(function(data) {
                	ctrl.opFormModel.taxQID = $filter("parseQID")(data[0].taxon.value);
                });

                // controls for navigating form
                ctrl.pageCount = 0;
                ctrl.nextClick = function () {
                    ctrl.pageCount += 1;
                };
                ctrl.backClick = function () {
                    ctrl.pageCount -= 1;
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
                    ctrl.opFormModel.pub.push($item);
                    ctrl.pubValue = '';
                };

                ctrl.removePub = function (delpub) {
                    console.log(delpub);
                    var removeValue = function (ikey, ivalue, ijson) {
                        var goodPubs = [];
                        angular.forEach(ijson, function (value, key) {
                            if (value[ikey] != ivalue) {
                                goodPubs.push(value);
                            }
                            else {
                            }
                        });
                        return goodPubs;
                    };
                    ctrl.opFormModel.pub = removeValue('uid', delpub.uid,
                        ctrl.opFormModel.pub);
                };

                ctrl.selectGene = function ($item, $model, $value) {
                    ctrl.opFormModel.genes.push(
                        {
                            gene: $item.gene.value,
                            locusTag: $item.locusTag.value
                        }
                    );
                    ctrl.geneValue = '';
                };

                ctrl.removeGene = function (gene) {
                    var removeValue = function (ikey, ivalue, ijson) {
                        var goodGenes = [];
                        angular.forEach(ijson, function (value, key) {
                            if (value[ikey] != ivalue) {
                                goodGenes.push(value);
                            }
                            else {
                            }
                        });
                        return goodGenes;
                    };
                    ctrl.opFormModel.genes = removeValue('locusTag', gene.locusTag,
                        ctrl.opFormModel.genes);
                };

                // form validation, must be true to allow submission
                ctrl.validateFields = function () {
                    if (ctrl.opFormModel.name && ctrl.opFormModel.pub && ctrl.opFormModel.genes.length > 0) {
                        return true;
                    }
                };

                // //send form data to server to edit wikidata
                ctrl.sendData = function (formData) {
                    ctrl.loading = true;
                    var url_suf = $location.path().replace("/authorized/", "") + '/wd_operon_edit';
                    
                    if (!$location.path().includes("authorized")) {
                        alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                        ctrl.loading = false;
                        return;
                    }
                    
                    sendToView.sendToView(url_suf, formData).then(function (data) {
                        if (data.data.operonWrite_success === true) {
                            alert("Successfully Annotated! Well Done! The annotation will appear here in a few minutes.");
                            ctrl.resetForm();
                        } else if (data.data.authentication === false){
                            console.log("FAILURE: AUTHENTICATION");
                        	console.log(data);
                            alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                        }
                        else {
                            alert("Something went wrong.  Give it another shot!");
                        }
                    }).finally(function () {
                        ctrl.loading = false;
                    });

                };
                ctrl.resetForm = function () {
                    ctrl.pageCount = 0;
                    ctrl.opFormModel.name = null;
                    ctrl.opFormModel.pub = null;
                    ctrl.opFormModel.genes = [];
                    ctrl.geneValue = '';
                    ctrl.pubValue = '';
                };


                
            };

        },
        templateUrl: '/static/build/js/angular_templates/operon-form.min.html',
        bindings: {
            allorggenes: '<',
            gene: '<',
            strand: '<'
        }
    });
