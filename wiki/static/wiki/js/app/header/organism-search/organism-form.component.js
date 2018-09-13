angular
    .module('organismForm')
    .component('organismForm', {
        controller: function ($location) {
            'use strict';
            var ctrl = this;
            ctrl.onSelect = function ($item) {
                $location.path('/organism/' + $item.taxid);
            };
        },
        templateUrl: '/static/build/js/angular_templates/organism-form.min.html',
        bindings: {
            orgs: '<'
        }
    });


