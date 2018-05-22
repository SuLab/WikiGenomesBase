angular
    .module('linkedPubs')
    .component('linkedPubs', {
        templateUrl: '/static/wiki/js/angular_templates/linked-pubs.html',
        bindings: {
            pubs: '<'
        },
        controller: function () {
            'use strict';
            var ctrl = this;

            ctrl.$onInit = function () {
            };
        }
    });
