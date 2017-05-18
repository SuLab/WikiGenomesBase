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
                var url_suf = $location.path() + '/wd_mutant_edit';
                console.log(url_suf);
                sendToView.sendToView(url_suf, formData).then(function (data) {
                    if (data.data.write_success === true) {
                        console.log(data);
                        alert("Successfully Annotated! Well Done! The annotation will appear here in a few minutes.");
                        //ctrl.resetForm();
                    }
                    else {
                        alert("Something went wrong.  Give it another shot!")
                        console.log(data);
                    }
                }).finally(function () {
                    ctrl.loading = false;
                });

            };


        },
        templateUrl: '/static/wiki/js/angular_templates/mutant-form.html'
    });

