angular
    .module('expressionView')
    .component('expressionView', {
        templateUrl: '/static/wiki/js/angular_templates/expression-view.html',
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
