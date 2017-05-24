angular
    .module('mutantForm')
    .component('mutantForm', {
        bindings: {
            data: '<'
        },

        controller: function (pubMedData, $location, $routeParams, sendToView) {
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.mutantAnnotation = {
                    taxid: $routeParams.taxid,
                    locusTag: $routeParams.locusTag
                };
                ctrl.pageCount = 0;
                ctrl.alerts = {
                    'success': false,
                    'error': false
                };
            };


            //controls for navigating form
            ctrl.nextClick = function () {
                ctrl.pageCount += 1;
            };
            ctrl.backClick = function () {
                ctrl.pageCount -= 1;
            };

            ctrl.seq_ontology_map = [
                {
                    alias: 'SYNONYMOUS',
                    name: 'synonymous',
                    id: 'SO:0001814'
                },
                {
                    alias: 'Non-neutral',
                    name: 'non-synonymous',
                    id: 'SO:0001816'
                },
                {
                    alias: 'NON-CODING',
                    name: 'non_transcribed_region',
                    id: 'SO:0000183'
                },
                {
                    alias: 'Neutral',
                    name: 'silent_mutation',
                    id: 'SO:0001017'
                },
                {
                    alias: 'NONSENSE',
                    name: 'stop_gained',
                    id: 'SO:0001017'
                }

            ];

            ctrl.mutant_type_map = [
                {
                    alias: 'chemical mutagenesis',
                    name: 'chemically induced mutation',
                    id:'EFO_0000370'
                },
                {
                    alias: 'transposon mutagenesis',
                    name: 'tbd',
                    id: 'tbd'
                }
            ];


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
                ctrl.mutantAnnotation.pub = $item;
                ctrl.pubValue = ''
            };

            ctrl.resetForm = function () {
                ctrl.$onInit();
            };

            //send form data to server to edit wikidata
            ctrl.sendData = function (formData) {
                ctrl.loading = true;
                formData.action = 'annotate';
                var url_suf = $location.path() + '/wd_mutant_edit';
                console.log(url_suf);
                sendToView.sendToView(url_suf, formData).then(function (data) {
                    if (data.data.write_success === true) {
                        ctrl.alerts.success = true;
                    }
                    else {
                        ctrl.alerts.error = true;
                    }
                }).finally(function () {
                    ctrl.loading = false;
                });

            };


        },
        templateUrl: '/static/wiki/js/angular_templates/mutant-form.html'
    });

