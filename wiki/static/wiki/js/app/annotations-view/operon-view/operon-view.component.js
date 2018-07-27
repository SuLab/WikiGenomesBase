angular
    .module('operonAnnotations')
    .component('operonAnnotations', {
        templateUrl: '/static/build/js/angular_templates/operon-view.min.html',
        bindings: {
            operon: '<'
        },
        controller: function () {
            var ctrl = this;
            ctrl.$onInit = function () {
            };
        }
    });
