angular
    .module('genomicPosition')
    .component('genomicPosition', {
        templateUrl: '/static/wiki/js/angular_templates/genomic-position.html',
        bindings: {
            data: '<'
        },
        controller: function () {
            var ctrl = this;
            ctrl.$onInit = function () {

            };
        }
    });
