angular
    .module('geneForm')
    .component('geneForm', {
        templateUrl: '/static/build/js/angular_templates/gene-form.min.html',
        bindings: {
            taxid: '<',
            genes: '<'
        },
        controller: function ($location) {
            'use strict';
            var ctrl = this;
            
            ctrl.onSelect = function ($item) {
                $location.path('/organism/' + ctrl.taxid + "/gene/" + $item.locusTag.value);
            };
        }
    });
