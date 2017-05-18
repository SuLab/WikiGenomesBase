angular
    .module('goForm')
    .component('goForm', {
        controller: function ($routeParams, $filter, $location, evidenceCodes, sendToView, pubMedData, allGoTerms, locusTag2QID) {
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.currentTaxid = $routeParams.taxid;
                ctrl.currentLocusTag = $routeParams.locusTag;

                locusTag2QID.getLocusTag2QID(ctrl.currentLocusTag, ctrl.currentTaxid).then(function (data) {

                    ctrl.geneQID = $filter('parseQID')(data.data.results.bindings[0].gene.value);
                    ctrl.proteinQID = $filter('parseQID')(data.data.results.bindings[0].protein.value);

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
                        proteinQID: ctrl.proteinQID,
                        goClass: goClassMap[ctrl.goclass].QID
                    };


                    //controls for navigating form
                    ctrl.pageCount = 0;
                    ctrl.nextClick = function () {
                        ctrl.pageCount += 1;
                    };
                    ctrl.backClick = function () {
                        ctrl.pageCount -= 1;
                    };

                    //data collection for form query sets
                    evidenceCodes.getevidenceCodes(function (data) {
                        ctrl.evidence = data;
                    });

                    ctrl.selectGoTerm = function ($item, $model, $label) {
                        ctrl.goFormModel.go = $item;
                        ctrl.goValue = ''
                    };

                    ctrl.selectPub = function ($item, $model, $label) {
                        ctrl.goFormModel.pub = $item;
                        ctrl.pubValue = ''
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


                    //form validation, must be true to allow submission
                    ctrl.validateFields = function () {
                        if (ctrl.goFormModel.evi && ctrl.goFormModel.pub && ctrl.goFormModel.go) {
                            return true
                        }
                    };

                    //send form data to server to edit wikidata
                    ctrl.sendData = function (formData) {
                        ctrl.loading = true;

                        var url_suf = $location.path() + '/wd_go_edit';
                        console.log(url_suf);
                        sendToView.sendToView(url_suf, formData).then(function (data) {
                            if(data.data.write_success === true){
                                alert("Successfully Annotated! Well Done! The annotation will appear here in a few minutes.");
                                ctrl.resetForm();
                            }
                            else{
                                alert("Something went wrong.  Give it another shot!")
                            }
                        }).finally(function(){
                            ctrl.loading = false;
                        });

                    };
                    ctrl.resetForm = function () {
                        ctrl.pageCount = 0;
                        ctrl.goFormModel.evi = null;
                        ctrl.goFormModel.pub = null;
                        ctrl.goFormModel.go = null;
                    };


                });
            };

        },
        templateUrl: '/static/wiki/js/angular_templates/guided-go-form.html',
        bindings: {
            goclass: '<',
            gene: '<'
        }

    });




