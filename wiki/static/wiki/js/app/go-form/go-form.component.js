angular
    .module('goForm')
    .component('goForm', {
        controller: function (evidenceCodes, goFormData, pubMedData, allGoTerms) {
            var ctrl = this;
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
                proteinQID: ctrl.gene.proteinQID,
                proteinLabel: ctrl.gene.proteinLabel,
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
                        console.log(data);
                        var resultData = [data.data.result[val]];
                        return resultData.map(function (item) {
                            return item;
                        });
                    }
                );
            };


            //form validation, must be true to allow submission
            ctrl.validateFields = function () {
                if (ctrl.goFormModel.evi && ctrl.goFormModel.pub && ctrl.goFormModel.go ) {
                    return true
                }
            };

            //send form data to server to edit wikidata
            ctrl.sendData = function (formData) {
                goFormData.getgoFormData('/wd_go_edit', formData).then(function (data) {
                    console.log(data);
                });

            };
            ctrl.resetForm = function () {
                ctrl.pageCount = 0;
                ctrl.goFormModel.evi = null;
                ctrl.goFormModel.pub = null;
                ctrl.goFormModel.go = null;
            };
        },
        templateUrl: '/static/wiki/js/angular_templates/guided-go-form.html',
        bindings: {
            goclass: '<',
            gene: '<'
        }

    });