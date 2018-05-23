angular
    .module('geneView')
    .component('geneView', {
        templateUrl: '/static/wiki/js/angular_templates/gene-view.html',
        controller: function () {
            'use strict';
            var ctrl = this;

        },
        bindings: {
            gene: '<'
        }
    });
