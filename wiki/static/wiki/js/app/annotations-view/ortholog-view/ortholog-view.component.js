angular
    .module('orthologView')
    .component('orthologView', {
        bindings: {
            data: '<'
        },
        controller: function ($filter) {
            var ctrl = this;
            ctrl.$onInit = function () {
            };
        },
        templateUrl: '/static/wiki/js/angular_templates/ortholog-view.html'
    });
