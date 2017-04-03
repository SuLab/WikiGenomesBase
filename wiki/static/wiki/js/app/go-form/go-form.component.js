angular
    .module('goForm')
    .component('goForm', {
        controller: function ($filter, $location, evidenceCodes, goFormData, pubMedData, allGoTerms, entrez2QID) {
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.currentTaxid = $location.path().split("/")[2];
                ctrl.currentEntrez = $location.path().split("/")[4];
                entrez2QID.getEntrez2QID(ctrl.currentEntrez).then(function (data) {
                    ctrl.geneQID = $filter('parseQID')(data.data.results.bindings[0].gene.value);
                    ctrl.proteinQID = $filter('parseQID')(data.data.results.bindings[0].gene.value);

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
                        proteinQID: ctrl.geneQID,
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

                    ctrl.getGoTermsAll = function (val) {
                        return allGoTerms.getGoTermsAll(val, goClassMap[ctrl.goclass].QID).then(
                            function (data) {
                                return data.data.results.bindings.map(function (item) {
                                    return item;
                                });
                            });
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
                        goFormData.getgoFormData('/wd_go_edit', formData).then(function (data) {
                            console.log(data.data);
                            if(data.data.ref_success === true){
                                alert("Successfully Annotated! Well Done! The annotation will appear here in a few minutes.")
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