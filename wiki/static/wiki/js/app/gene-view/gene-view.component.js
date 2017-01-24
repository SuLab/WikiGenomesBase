angular
    .module('geneView')
    .component('geneView', {
        templateUrl: '/static/wiki/js/angular_templates/gene-view.html',
        controller: function () {
            var ctrl = this;

        },
        bindings: {
            gene: '<'
        }
    });
