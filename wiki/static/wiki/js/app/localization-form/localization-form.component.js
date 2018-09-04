angular
    .module('localizationForm')
    .component('localizationForm', {
        controller: function ($location, $routeParams, pubMedData, sendToView, locusTag2QID, entrez2QID, orthoDataByLocusTag, orthoDataByEntrez, appData, $filter, taxidFilter) {
            'use strict';
            var ctrl = this;

            ctrl.currentTaxid = $routeParams.taxid;
            ctrl.currentLocusTag = $routeParams.locusTag;
            ctrl.pageCount = 0;

            taxidFilter.map().then(function(data) {
                ctrl.tax2Name = data;
            });

            ctrl.orthoData = {};
            ctrl.projection = {};
            appData.getAppData(function (data) {

                ctrl.appData = data;

                var factory = orthoDataByLocusTag;

                if (data.primary_identifier == "entrez") {
                    factory = orthoDataByEntrez;
                }
                factory.getOrthologs(ctrl.currentLocusTag).then(function (response) {

                    // now add results from sparql query
                    angular.forEach(response.results.bindings, function (obj) {
                        var tax = obj.orthoTaxid.value;
                        var tag;
                        if (data.primary_identifier == "entrez") {
                            tag = obj.entrez.value;
                        } else {
                            tag = obj.orthoLocusTag.value;
                        }
                        ctrl.projection[tax] = tag == ctrl.currentLocusTag;
                        ctrl.orthoData[tax] = tag;
                    });

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
                localizationQID: null,
                increased: null
            };

            ctrl.selectForm = function () {
                if (ctrl.localizationAnnotation.localizationQID.name != "elementary body AND reticulate body") {
                    ctrl.localizationAnnotation.increased = null;
                }
            };

            ctrl.map = [
                {
                    name: 'elementary body',
                    qid: ['Q51955212']
                },
                {
                    name: 'reticulate body',
                    qid: ['Q51955198']
                },
                {
                    name: 'elementary body AND reticulate body',
                    qid: ['Q51955212', 'Q51955198']
                }
            ];

            ctrl.increasedMap = [
                {
                    name: 'elementary body',
                    qid: 'Q51955212'
                },
                {
                    name: 'reticulate body',
                    qid: 'Q51955198'
                },
                {
                    name: 'neither',
                    qid: null
                }
            ];

            ctrl.relativeTo = {
                'Q51955212': 'Q51955198',
                'Q51955198': 'Q51955212'
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

                var atleastone = false;
                angular.forEach(ctrl.projection, function (value) {
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

                angular.forEach(ctrl.projection, function (value, key) {
                    if (value) {
                        var factory = locusTag2QID;
                        if (ctrl.appData.primary_identifier == "entrez"){
                            factory = entrez2QID;
                        }
                        factory.getQID(ctrl.orthoData[key], key).then(function (data) {

                            var formData = {
                                proteinQID: null,
                                pub: ctrl.pubValue.uid,
                                localizationQID: ctrl.localizationAnnotation.localizationQID.qid,
                                increased: null,
                                relativeTo: null
                            };

                            if (data.data.results.bindings[0].protein) {
                                formData.proteinQID = $filter('parseQID')(data.data.results.bindings[0].protein.value);
                            }

                            if (ctrl.localizationAnnotation.increased != null) {
                                formData.increased = ctrl.localizationAnnotation.increased.qid;
                                formData.relativeTo = ctrl.relativeTo[formData.increased];
                            }

                            if (formData.proteinQID == null) {
                                return;
                            }

                            var url_suf = '/organism/' + key + '/gene/' + ctrl.orthoData[key] + '/wd_localization_edit';

                            console.log(url_suf);
                            sendToView.sendToView(url_suf, formData).then(function (data) {
                                if (data.data.authentication === false) {
                                    authorize = true;
                                    success = false;
                                }
                                else if (!data.data.write_success) {
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
                ctrl.pubValue = null;
                ctrl.localizationAnnotation = {
                    proteinQID: null,
                    pub: null,
                    localizationQID: null,
                    increased: null
                };

            };
        },


        templateUrl: '/static/build/js/angular_templates/localization-form.min.html'
    });


