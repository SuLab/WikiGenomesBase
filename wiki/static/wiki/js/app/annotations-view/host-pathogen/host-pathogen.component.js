angular
    .module('hostPathogen')
    .component('hostPathogen', {
        templateUrl: '/static/build/js/angular_templates/host-pathogen.min.html',
        bindings: {
            data: '<'
        },
        controller: function () {
            'use strict';
            var ctrl = this;
        }
    });
