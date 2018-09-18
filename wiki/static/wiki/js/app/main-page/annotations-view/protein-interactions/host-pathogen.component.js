angular
    .module('hostPathogen')
    .component('hostPathogen', {
        templateUrl: '/static/build/js/angular_templates/protein-interactions-view.min.html',
        bindings: {
            data: '<'
        },
        controller: function ($location, $filter) {
            'use strict';
            var ctrl = this;

            ctrl.checkAuthorization = function(modal) {
                if (!$location.path().includes("authorized")) {
                    alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                } else {
                    $("#" + modal).modal('show');
                }
            };

            ctrl.$onChanges = function() {
              if (ctrl.data) {
                  ctrl.hostData = $filter('interactions2host')(ctrl.data);
                  ctrl.bacData = $filter('interactions2bacteria')(ctrl.data);
              }
            };
        }
    });
