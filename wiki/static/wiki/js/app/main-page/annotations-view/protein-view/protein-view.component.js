angular
    .module('proteinView')
    .component('proteinView', {
        templateUrl: '/static/build/js/angular_templates/protein-view.min.html',
        controller: function ($location) {
            'use strict';
            var ctrl = this;

            ctrl.checkAuthorization = function(modal) {
                if (!$location.path().includes("authorized")) {
                    alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                    // $("#errorProtein").modal('show');
                } else {
                    $("#" + modal).modal('show');
                }
            };

        },
        bindings: {
            protein: '<'
        }
    });
