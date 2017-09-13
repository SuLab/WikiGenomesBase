angular
    .module('orthologView')
    .component('orthologView', {
        bindings: {
            data: '<'
        },
        controller: function ($scope) {

	    // for selecting from the check list
	    $scope.select = function(item) {
		item.selected = !item.selected;
	    };

	    // creates a list of the selected orthologs
	    $scope.updateSelected = function(data) {
		$scope.selected = [];
		angular.forEach(data, function(value, key) {
			if (value.selected) {
				$scope.selected.push(key);
			}
		});
		console.log($scope.selected);
	    };
	
            // the bootstrap menu at the top of the widget'
	    $scope.menu = {
		    el: document.getElementById("msaDiv"),
		    vis: {
		      conserv: false,
		      overviewbox: false
		    },
		    // smaller menu for JSBin
		    menu: "small",
		    bootstrapMenu: true
	    };
	    
	    // the viewing panel
	    $scope.msa = new msa.msa($scope.menu);

	    // the function to render the viewing panel
	    $scope.align = function() {
		  $scope.msa.render();
	    };

	    // function to update the selected list and align after
	    $scope.updatePanel = function(data) {
		$scope.updateSelected(data);
		$scope.align();
	    };

	    // set up the data
	    $scope.msa.u.file.
		importURL("http://rostlab.org/~goldberg/jalv_example.clustal", 	    			$scope.align);
	    
        },
        templateUrl: '/static/wiki/js/angular_templates/ortholog-view.html'
    });
