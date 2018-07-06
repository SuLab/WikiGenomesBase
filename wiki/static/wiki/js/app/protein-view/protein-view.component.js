angular
    .module('proteinView')
    .component('proteinView', {
        templateUrl: '/static/build/js/angular_templates/protein-view.min.html',
        controller: function () {
            'use strict';
            var ctrl = this;
        },
        bindings: {
            protein: '<'
        }
    });
