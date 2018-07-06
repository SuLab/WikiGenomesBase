angular
    .module('genomicPosition')
    .component('genomicPosition', {
        templateUrl: '/static/build/js/angular_templates/genomic-position.min.html',
        bindings: {
            data: '<'
        },
        controller: function () {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function () {
            };
        }
    });
