angular
    .module('operonAnnotations')
    .component('operonAnnotations', {
        templateUrl: '/static/build/js/angular_templates/operon-view.min.html',
        bindings: {
            operon: '<',
            allorggenes: '<',
            gene: '<'
        },
        controller: function (NgTableParams) {
            var ctrl = this;
            
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
