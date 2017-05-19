angular
    .module('mutantsView')
    .component('mutantsView', {
        bindings: {
            data: '<'
        },
        controller: function ($location, sendToView) {
            var ctrl = this;
            ctrl.deleteAnnotation = function(mutant){
                ctrl.loading = true;
                mutant.action = 'delete';
                var url_suf = $location.path() + '/wd_mutant_edit';
                console.log(mutant);
                sendToView.sendToView(url_suf, mutant).then(function (data) {
                    console.log(data);

                }).finally(function () {
                    ctrl.loading = false;
                });

            };




        },
        templateUrl: '/static/wiki/js/angular_templates/mutants-view.html'
    });

