angular
    .module('hostPathogen')
    .component('hostPathogen', {
        templateUrl: '/static/build/js/angular_templates/protein-interactions-view.min.html',
        bindings: {
            data: '<'
        },
        controller: function (NgTableParams, $location, $filter) {
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

                  var parsedHost = [];
                  angular.forEach(ctrl.hostData, function(obj) {
                      var next = {};
                      angular.forEach(obj, function(value, key) {
                          if (value.value === parseInt(value.value)) {
                              next[key] = parseInt(value.value);
                          } else {
                              next[key] = value.value;
                          }
                      });
                      parsedHost.push(next);
                  });

                  var parsedBac = [];
                  angular.forEach(ctrl.bacData, function(obj) {
                      var next = {};
                      angular.forEach(obj, function(value, key) {
                          if (value.value === parseInt(value.value)) {
                              next[key] = parseInt(value.value);
                          } else {
                              next[key] = value.value;
                          }
                      });
                      parsedBac.push(next);
                  });

                  ctrl.hpiParams = new NgTableParams(
                      {
                          page:1,
                          count: 10
                      },
                      {
                          dataset: parsedHost
                      }
                  );

                  ctrl.bpParams = new NgTableParams(
                      {
                          page:1,
                          count: 10
                      },
                      {
                          dataset: parsedBac
                      }
                  );
              }
            };
        }
    });
