angular
    .module('organismForm')
    .component('organismForm', {
        controller: function ($location) {
            var ctrl = this;
            ctrl.onSelect = function ($item) {
                $location.path('/organism/' + $item.taxid);
            };
        },
        templateUrl: '/static/wiki/js/angular_templates/organism-form.html',
        bindings: {
            orgs: '<'
        }
    });


