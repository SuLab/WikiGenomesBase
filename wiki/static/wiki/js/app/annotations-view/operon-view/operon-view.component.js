angular
    .module('operonAnnotations')
    .component('operonAnnotations', {
        templateUrl: '/static/wiki/js/angular_templates/operon-view.html',
        bindings: {
            data: '<',
            operon: '<'
        },
        controller: function () {
            var ctrl = this;
            ctrl.$onInit = function () {
            };
        }
    });
