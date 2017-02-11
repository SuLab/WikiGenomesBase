angular
    .module('goForm')
    .component('goForm', {
        controller: function (evidenceCodes, goFormData, pubMedData, allGoTerms) {
            var ctrl = this;
            var goClassMap = {
                'mf_button': 'Q14860489',
                'cc_button': 'Q5058355',
                'bp_button': 'Q2996394'
            };
            ctrl.formData = {};


            evidenceCodes.getevidenceCodes(function (data) {
                ctrl.evidence = data;
            });

            ctrl.goInput = angular.element(window).find('#goInput');
            ctrl.eviInput = angular.element(window).find('#eviInput');
            ctrl.goInput = angular.element(window).find('#pubInput');


            ctrl.getGoTermsAll = function (val) {
                return allGoTerms.getGoTermsAll(val, goClassMap[ctrl.goclass]).then(
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

            ctrl.sendData = function (formData) {
                console.log(formData);
                ctrl.goFormModel = null;
                goFormData.getgoFormData('/wd_go_edit', formData).then(function (data) {
                    console.log(data);
                });

            };


        },
        templateUrl: '/static/wiki/js/angular_templates/go-form.html',
        bindings: {
            goclass: '<'
        }

    });
