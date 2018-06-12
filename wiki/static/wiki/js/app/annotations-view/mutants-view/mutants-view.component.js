angular
    .module('mutantsView')
    .component('mutantsView', {
        bindings : {
            data : '<'
        },
        controller : function($location, sendToView) {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function() {};
            ctrl.deleteAnnotation = function(mutant) {
                console.log(mutant);
                ctrl.loading = true;
                mutant.action = 'delete';
                var url_suf = $location.path() + '/wd_mutant_edit';
                sendToView.sendToView(url_suf, mutant).then(function(data) {}).finally(function() {
                    ctrl.loading = false;
                });
            };

        },
        templateUrl : '/static/wiki/js/angular_templates/mutants-view.html'
    });