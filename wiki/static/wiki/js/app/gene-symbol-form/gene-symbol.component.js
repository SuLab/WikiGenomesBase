angular
    .module("geneSymbolForm")
    .controller("symbolFormCtrl", function ($location, sendToView, orthoData, locusTag2QID, $filter, pubMedData) {
        'use strict';

        var ctrl = this;

        ctrl.orthoData = {};
        ctrl.projection = {};
        orthoData.getOrthologs(ctrl.gene.locusTag).then(function (response) {

            // now add results from sparql query
            angular.forEach(response.results.bindings, function (obj) {
                var tax = obj.orthoTaxid.value;
                var tag = obj.orthoLocusTag.value;
                ctrl.projection[tax] = tag == ctrl.gene.locusTag;
                ctrl.orthoData[tax] = tag;
            });

        });

        ctrl.pageCount = 0;

        ctrl.nextClick = function () {
            ctrl.pageCount += 1;
        };

        ctrl.backClick = function () {
            ctrl.pageCount -= 1;
        };

        ctrl.geneSymbolData = {
            geneQID: null,
            proteinQID: null,
            geneSymbol: "",
            pmid: null
        };

        ctrl.resetForm = function () {
            ctrl.geneSymbolData.geneSymbol = "";
            ctrl.geneSymbolData.pmid = null;
            ctrl.pageCount = 0;
        };

        ctrl.$onChanges = function () {
            ctrl.geneSymbolData.geneQID = ctrl.gene.geneQID;
            ctrl.geneSymbolData.proteinQID = ctrl.gene.proteinQID;
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
        ctrl.selectPub = function ($item) {
            ctrl.geneSymbolData.pmid = $item.uid;
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
                if (value) {
                    locusTag2QID.getLocusTag2QID(ctrl.orthoData[key], key).then(function (data) {

                        var formData = {
                            geneQID: $filter('parseQID')(data.data.results.bindings[0].gene.value),
                            proteinQID: null,
                            geneSymbol: ctrl.geneSymbolData.geneSymbol,
                            pmid: ctrl.geneSymbolData.pmid
                        };

                        if (data.data.results.bindings[0].protein) {
                            formData.proteinQID = $filter('parseQID')(data.data.results.bindings[0].protein.value);
                        }

                        var url_suf = '/organism/' + key + '/gene/' + ctrl.orthoData[key] + '/wd_gene_symbol_edit';

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
    .component("geneSymbolForm", {
        controller: "symbolFormCtrl",
        templateUrl: "/static/build/js/angular_templates/gene-symbol-form.min.html",
        bindings: {
            gene: "<"
        }
    });