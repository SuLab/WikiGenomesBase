angular
    .module('operonForm')
    .component('operonForm', {
        controller: function ($routeParams, $location, $filter, pubMedData, locusTag2QID, allOrgGenes, allOrgOperons, allChlamOrgs,
                              sendToView) {
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.currentTaxid = $routeParams.taxid;
                ctrl.currentLocusTag = $routeParams.locusTag;
                ctrl.alerts = {
                    'success': false,
                    'error': false
                };
                locusTag2QID.getLocusTag2QID(ctrl.currentLocusTag, ctrl.currentTaxid).then(function (data) {
                    ctrl.geneQID = $filter('parseQID')(data.data.results.bindings[0].gene.value);
                    ctrl.opFormModel = {
                        operon: null,
                        pub: null,
                        genes: [],
                        geneQID: ctrl.geneQID,
                        organism: null
                    };

                    //controls for navigating form
                    ctrl.pageCount = 0;
                    ctrl.nextClick = function () {
                        ctrl.pageCount += 1;
                        console.log(ctrl.data);
                    };
                    ctrl.backClick = function () {
                        ctrl.pageCount -= 1;
                    };

                    allOrgGenes.getAllOrgGenes(ctrl.currentTaxid).then(function (data) {
                        ctrl.allOrgGenes = data.data.results.bindings;
                    });

                    allChlamOrgs.getAllOrgs(function (data) {
                        ctrl.orgList = data;
                        ctrl.opFormModel.organism = $filter('getJsonItemOrg')('taxid', ctrl.currentTaxid,
                            ctrl.orgList);
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
                        ctrl.opFormModel.pub = $item;
                        ctrl.pubValue = ''
                    };


                    ctrl.nameOperon = function (name) {
                        if (name) {
                            ctrl.opFormModel.operon = {
                                operon: {value: 'None'},
                                operonLabel: {value: name}
                            };
                            ctrl.opNewName = '';
                        }

                    };

                    ctrl.selectGene = function ($item, $model, $value) {
                        ctrl.opFormModel.genes.push(
                            {
                                gene: $item.gene.value,
                                locusTag: $item.locusTag.value
                            }
                        );
                        ctrl.geneValue = ''
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
                            return goodGenes
                        };
                        ctrl.opFormModel.genes = removeValue('locusTag', gene.locusTag,
                            ctrl.opFormModel.genes);
                    };

                    //form validation, must be true to allow submission
                    ctrl.validateFields = function () {
                        if (ctrl.opFormModel.operon && ctrl.opFormModel.pub && ctrl.opFormModel.genes.length > 0) {
                            return true
                        }
                    };

                    ////send form data to server to edit wikidata
                    ctrl.sendData = function (formData) {
                        ctrl.loading = true;
                        var url_suf = $location.path() + '/wd_operon_edit';
                        sendToView.sendToView(url_suf, formData).then(function (data) {
                            if (data.data.operonWrite_success === true) {
                                alert("Successfully Annotated! Well Done! The annotation will appear here in a few minutes.");
                                ctrl.resetForm();
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
                        ctrl.opFormModel.operon = null;
                        ctrl.opFormModel.pub = null;
                        ctrl.opFormModel.genes = [];
                        ctrl.operonValue = '';
                        ctrl.geneValue = '';
                        ctrl.pubValue = '';
                    };


                });
            };

        },
        templateUrl: '/static/wiki/js/angular_templates/operon-form.html',
        bindings: {
            data: '<',
            operon: '<'
        }
    });
