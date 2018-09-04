angular
    .module("geneNameForm")
    .controller("geneNameCtrl", function ($location, sendToView, orthoDataByEntrez, orthoDataByLocusTag, appData, $routeParams, locusTag2QID, entrez2QID, $filter, taxidFilter) {
        'use strict';

        var ctrl = this;

        ctrl.locusTag = $routeParams.locusTag;

        taxidFilter.map().then(function (data) {
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
            factory.getOrthologs(ctrl.locusTag).then(function (response) {

                // now add results from sparql query
                angular.forEach(response.results.bindings, function (obj) {
                    var tax = obj.orthoTaxid.value;

                    var tag;
                    if (data.primary_identifier == "entrez") {
                        tag = obj.entrez.value;
                    } else {
                        tag = obj.orthoLocusTag.value;
                    }

                    ctrl.projection[tax] = tag == ctrl.locusTag;
                    ctrl.orthoData[tax] = tag;
                });

            });
        });

        ctrl.pageCount = 0;

        ctrl.nextClick = function () {
            ctrl.pageCount += 1;
        };

        ctrl.backClick = function () {
            ctrl.pageCount -= 1;
        };

        ctrl.geneNameData = {
            geneQID: null,
            proteinQID: null,
            geneName: ""
        };

        ctrl.resetForm = function () {
            ctrl.geneNameData.geneName = "";
            ctrl.pageCount = 0;
        };

        ctrl.$onChanges = function () {
            ctrl.geneNameData.geneQID = ctrl.gene.geneQID;
            ctrl.geneNameData.proteinQID = ctrl.gene.proteinQID;
        };

        // send form data to server to edit wikidata
        ctrl.sendData = function () {
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
                return;
            }

            angular.forEach(ctrl.projection, function (value, key) {

                var factory = locusTag2QID;
                if (ctrl.appData.primary_identifier == "entrez"){
                    factory = entrez2QID;
                }

                if (value) {
                    factory.getQID(ctrl.orthoData[key], key).then(function (data) {

                        var formData = {
                            geneQID: $filter('parseQID')(data.data.results.bindings[0].gene.value),
                            proteinQID: null,
                            geneName: ctrl.geneNameData.geneName
                        };

                        if (data.data.results.bindings[0].protein) {
                            formData.proteinQID = $filter('parseQID')(data.data.results.bindings[0].protein.value);
                        }

                        var url_suf = '/organism/' + key + '/gene/' + ctrl.orthoData[key] + '/wd_gene_name_edit';

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

                        ctrl.resetForm();
                    }
                }
            });

        };

    })
    .component("geneNameForm", {
        bindings: {
            gene: "<"
        },
        templateUrl: "/static/build/js/angular_templates/gene-name-form.min.html",
        controller: "geneNameCtrl"
    });