angular
    .module('operonAnnotations')
    .component('operonAnnotations', {
        templateUrl: '/static/build/js/angular_templates/operon-view.min.html',
        bindings: {
            operon: '<',
            allorggenes: '<',
            gene: '<'
        },
        controller: function (NgTableParams, $location) {
            var ctrl = this;

            ctrl.checkAuthorization = function(modal) {
                if (!$location.path().includes("authorized")) {
                    // alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                    $("#errorOperon").modal('show');
                } else {
                    $("#" + modal).modal('show');
                }
            };

            ctrl.$onChanges = function() {
                if (ctrl.operon) {
                	var parsed = [];
                	angular.forEach(ctrl.operon, function(obj) {
                		var next = {};
                		angular.forEach(obj, function(value, key) {
                			if (value.value === parseInt(value.value)) {
                				next[key] = parseInt(value.value);
                			} else {
                				next[key] = value.value;
                			}
                		});
                		parsed.push(next);
                	});

	                ctrl.tableParams = new NgTableParams(
	                	{
	                		page:1,
	                		count: 10
	                	},
	                	{
	                		dataset: parsed
	                	}
	                );
                }
            };
        }
    });
