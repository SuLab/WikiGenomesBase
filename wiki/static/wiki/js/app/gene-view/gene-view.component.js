angular
    .module('geneView')
    .component('geneView', {
        templateUrl: '/static/build/js/angular_templates/gene-view.min.html',
        controller: function () {
            'use strict';
            var ctrl = this;

        },
        bindings: {
            gene: '<'
        }
    });
