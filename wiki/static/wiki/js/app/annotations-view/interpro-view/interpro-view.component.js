angular
    .module('interPro')
    .component('interPro', {
        templateUrl: '/static/build/js/angular_templates/interpro-view.min.html',
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