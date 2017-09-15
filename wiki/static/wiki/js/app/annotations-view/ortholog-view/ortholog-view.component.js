angular.module('orthologView').component('orthologView', {

	bindings: {
		data: '<'
	},

	controller: function ($scope, $http) {

	// for selecting from the check list
	$scope.select = function(item) {
		item.selected = !item.selected;
	};

	// creates a list of the selected orthologs
	$scope.updateSelected = function(data) {

		// clear the previous selected list
		$scope.selected = [];

		// loop through the ortholog list and check if selected
		angular.forEach(data, function(value, key) {

			// true if selected
			if (value.selected) {
				// store the ncbi data to use later
				$scope.selected.push(value.ncbi);
			}
	});
	};

	// the bootstrap menu at the top of the widget
	var menu = {
		el: document.getElementById("msaDiv"),
    		vis: {
			conserv: false,
			overviewbox: false
    		},
    		// smaller menu for JSBin
		menu: "small",
      		bootstrapMenu: true
	};

	// the msa viewing panel
	$scope.msa = new msa.msa(menu);

	// function to update the selected list and align after
	$scope.updatePanel = function(data) {

		// get the list of selected orthologs by ncbi
		$scope.updateSelected(data);

		// create a temporary array to hold UIDs (not ncbi)
		var selectedIds = [];

		// remaining number of orthologs to parse
		var remaining = $scope.selected.length;

		// get the sequence data based on ncbi
		angular.forEach($scope.selected, function(value) {

			// first get the UID from the nuccore database
			$http.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term=' + value).then(function(response) {

				// this ortholog is being processed
				remaining--;

				// the request succeeded
				if (response.status == 200) {
					// data in string as xml, find the ID
					var xml = response.data;
					if (xml.includes("<Id>")) {
						var id = xml.substring(xml.indexOf("<Id>") + 4, xml.indexOf("</Id>"));

						// add the id to the list
						selectedIds.push(id);
					}
				}

				// all orthologs have been processed, so proceed to next step
				if (remaining == 0) {

					// debug ids
					console.log(selectedIds.join());
					// http://www.ebi.ac.uk/Tools/services/rest/muscle/result/muscle-I20170914-222804-0757-67922191-oy/aln-fasta

					// temporary display w/o alignment
					$scope.msa.u.file.importURL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&rettype=fasta&retmode=text&seq_start=1&seq_stop=100&id=' + selectedIds.join(),
					function () {
						$scope.msa.render();
					});

					// now construct the sequences
					/*$http.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&rettype=fasta&retmode=text&id=' + $scope.selectedIds.join()).then(function (resp) {

						// data to send to muscle
						var content = {
	  						"email": "djow@ucsd.edu",
	  						"title": "ortholog alignment",
	  						"format": "fasta",
	  						"tree": "tree1",
	  						"order": "aligned",
	  						"sequence": resp.data
	  					};

						// send as json
	  					var header = {
	  						"Content-Type": "application/json"
	  					};

						// submit post to MUSCLE
	  					$http.post('http://www.ebi.ac.uk/Tools/services/rest/muscle/run/', content, header).then(function (success) {
	  				
							// JOB ID for muscle
							var id = success.data;
	 						console.log("Job ID:" + id);

							// now wait for the data to finish
							var done = false;
							while (!done) {

								// check the status
								$http.get('http://www.ebi.ac.uk/Tools/services/rest/muscle/status/' + success.data).then(function (response) {
									done = response.data != "RUNNING";
								});
							}

							// data has been aligned, now display it
							$scope.msa.u.file.importURL("http://www.ebi.ac.uk/Tools/services/rest/muscle/result/" + id + "/aln-fasta",
							function () {
								$scope.msa.render();
							});

							// there was an error with the POST request
						}, function (error) {
							console.log("Error" + error.status);
							console.log(error.config);
						});
					}); // get }*/

				} // remaining }
			}); // outer get
		}); // for each }

	}; // update panel function }
	}, // controller function }
	templateUrl: '/static/wiki/js/angular_templates/ortholog-view.html'
});
