angular
    .module('enzymeView')
    .component('enzymeView', {
        templateUrl: '/static/wiki/js/angular_templates/enzyme-view.html',
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
