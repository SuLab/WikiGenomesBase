angular
    .module('expressionView')
    .component('expressionView', {
        templateUrl: '/static/build/js/angular_templates/expression-view.min.html',
        bindings: {
            data: '<',
            gene: '<'
        },
        controller: function ($location) {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function () {

            };

            ctrl.checkAuthorization = function(modal) {
                if (!$location.path().includes("authorized")) {
                    alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                } else {
                    $("#" + modal).modal('show');
                }
            };
        }
    });
