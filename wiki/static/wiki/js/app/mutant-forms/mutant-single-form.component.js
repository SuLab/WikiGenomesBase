angular
    .module('mutantForm')
    .component('mutantForm', {
        bindings: {
            data: '<'
        },

        controller: function (pubMedData, $location, $routeParams, sendToView) {
            var ctrl = this;

            //ctrl.mutantAnnotation ={
            //    locus_tag
            //};
            //controls for navigating form
            ctrl.pageCount = 0;

            ctrl.nextClick = function () {
                ctrl.pageCount += 1;
            };
            ctrl.backClick = function () {
                ctrl.pageCount -= 1;
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
                ctrl.mutantAnnotation.pub = $item;
                ctrl.pubValue = ''
            };

            ctrl.resetForm = function () {
                ctrl.pageCount = 0;
                ctrl.mutantAnnotation = null;
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
                        ctrl.resetForm();
                    }
                    else {
                        alert("Something went wrong.  Give it another shot!")
                    }
                }).finally(function () {
                    ctrl.loading = false;
                });

            };


        },
        templateUrl: '/static/wiki/js/angular_templates/mutant-form.html'
    });

