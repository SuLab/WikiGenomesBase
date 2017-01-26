angular
    .module('geneOntology')
    .component('geneOntology', {
        templateUrl: '/static/wiki/js/angular_templates/gene-ontology-view.html',
        bindings: {
            data: '<',
            goclass: '<'
        },
        controller: function () {
            var ctrl = this;

            ctrl.$onInit = function () {
            };
        }
    });