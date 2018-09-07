angular
    .module('enzymeView')
    .component('enzymeView', {
        templateUrl: '/static/build/js/angular_templates/enzyme-view.min.html',
        bindings: {
            reaction: '<',
            ecnumber: '<'
        },
        controller: function () {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function () {

            };
        }
    });
