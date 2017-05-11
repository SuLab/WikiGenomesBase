/**
 * Created by timputman on 5/10/17.
 */
angular
    .module('functionalAnnotation')
    .component('functionalAnnotation', {
        templateUrl: '/static/wiki/js/angular_templates/functional-annotation.html',
        bindings: {
            data: '<',
            config: '<'
        },
        controller: function () {
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.title = ctrl.config.title + " ({title})".replace('{title}', ctrl.data.length);

            };
        }
    });
