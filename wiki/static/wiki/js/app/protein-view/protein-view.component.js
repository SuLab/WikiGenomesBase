angular
    .module('proteinView')
    .component('proteinView', {
        templateUrl: '/static/wiki/js/angular_templates/protein-view.html',
        controller: function () {
            'use strict';
            var ctrl = this;
        },
        bindings: {
            protein: '<'
        }
    });
