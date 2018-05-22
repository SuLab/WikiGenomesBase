angular
    .module('hostPathogen')
    .component('hostPathogen', {
        templateUrl: '/static/wiki/js/angular_templates/host-pathogen.html',
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
