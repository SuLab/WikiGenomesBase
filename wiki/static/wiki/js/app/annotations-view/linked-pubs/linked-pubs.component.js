angular
    .module('linkedPubs')
    .component('linkedPubs', {
        templateUrl: '/static/build/js/angular_templates/linked-pubs.min.html',
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
