angular
    .module('mutantsView')
    .component('mutantsView', {
        bindings: {
            data: '<'
        },
        controller: function () {
            var ctrl = this;

        },
        templateUrl: '/static/wiki/js/angular_templates/mutants-view.html'
    });

