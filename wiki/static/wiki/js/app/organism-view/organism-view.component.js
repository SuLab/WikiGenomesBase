angular
    .module('organismView')
    .component('organismView', {
        templateUrl: '/static/wiki/js/angular_templates/organism-view.html',
        controller: function () {
            var ctrl = this;

        },
        bindings: {
            org: '<'
        }
    });