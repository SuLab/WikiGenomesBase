/**
 * Created by timputman on 5/10/17.
 */
angular
    .module('functionalAnnotation')
    .component('functionalAnnotation', {
        templateUrl: '/static/build/js/angular_templates/functional-annotation.min.html',
        bindings: {
            data: '<',
            config: '<'
        },
        controller: function () {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.title = ctrl.config.title + " ({title})".replace('{title}', ctrl.data.length);

            };
        }
    });
