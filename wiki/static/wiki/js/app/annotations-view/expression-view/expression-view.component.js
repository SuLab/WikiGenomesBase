angular
    .module('expressionView')
    .component('expressionView', {
        templateUrl: '/static/build/js/angular_templates/expression-view.min.html',
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
