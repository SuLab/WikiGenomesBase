angular.module('orthologView').component('orthologView', {

    bindings: {
        data: '<'
    },

    controller: function ($scope, $http) {

    // called after data binding
    this.$onInit = function () {
        console.log("On Init Called");
    };

    // whether or not to invert selection when selecting all
    $scope.invertSelection = true;

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

    // function to update the selected list and align after
    $scope.updatePanel = function(data) {

        // whether or not to invert selection
	if ($scope.invertSelection) {
	    angular.forEach(data, function(value, key) {
	        $scope.select(value);
	    });
	    $scope.invertSelection = false;
	}

        // get the list of selected orthologs by ncbi
        $scope.updateSelected(data);

        // create a temporary array to hold UIDs (not ncbi)
        var selectedIds = [];

        // remaining number of orthologs to parse
        var remaining = $scope.selected.length;

        // get the sequence data based on ncbi
        angular.forEach($scope.selected, function(value) {

            // first get the UID from the nuccore database
            $http.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=' + value).then(function(response) {

                // the request succeeded
                if (response.status == 200) {
                    // data in string as xml, find the ID
                    var xml = response.data;
                    if (xml.includes("<Id>")) {

                        // extract the id
                        var id = xml.substring(xml.indexOf("<Id>") + 4, xml.indexOf("</Id>"));

                        // now that we have the ID, get the start and stop from the summary
                        $http.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=' + id).then(function(resp) {

                            // summary has been processed
                            remaining--;
                            
                            // the response is in  xml again, take out the stop and start sequences
                            xml = resp.data;
                            var start = xml.substring(xml.indexOf("<ChrStart>") + 10, xml.indexOf("</ChrStart>"));
                            var stop = xml.substring(xml.indexOf("<ChrStop>") + 9, xml.indexOf("</ChrStop>"));
                            var accession = xml.substring(xml.indexOf("<ChrAccVer>") + 11, xml.indexOf("</ChrAccVer>"));
                            
                            // now save the start and stop as an entry in the selectedIds array
                            selectedIds.push([accession, start, stop]);

                            // all orthologs have been processed, so proceed to next step
                            if (remaining == 0) {

                                // reset the count for the efetch process
                                remaining = selectedIds.length;

                                // stores the sequences
                                var data = [];

                                // now get efetch the sequence from each entry in selectedIDs 
                                angular.forEach(selectedIds, function(value) {

                                    // get the values from the entry
                                    accession = value[0];

                                    // entries are zero offset
                                    start = parseInt(value[1]) + 1;
                                    stop = parseInt(value[2]) + 1;
                                    var strand = 1;

                                    // determine the strand
                                    if (start > stop) {

                                        // strand 2 when start > stop
                                        strand = 2;

                                        // now swap the start and stop
                                        var temp = start;
                                        start = stop;
                                        stop = temp;
                                    }

                                    // now do the efetch
                                    $http.get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=" + 
                                        accession + "&seq_start=" + start + "&seq_stop=" + stop + "&strand=" + strand + "&rettype=fasta").then(function (r) {

                                        // efetch has been processed
                                        remaining--;

                                        // add to the data list
                                        data.push(r.data);

                                        // all orthologs processed
                                        if (remaining == 0) {

                                            // data to send to muscle
                                            var content = {
                                                email: "djow@ucsd.edu",
                                                title: "ortholog alignment",
                                                format: "fasta",
                                                tree: "tree1",
                                                order: "aligned",
                                                sequence: data.join()
                                            };

                                            // submit post to MUSCLE using shorthand method in json
                                            $http.post('http://www.ebi.ac.uk/Tools/services/rest/muscle/run/', content).then(function (success) {

                                                // JOB ID for muscle
                                                var id = success.data;
                                                console.log("Job ID:" + id);

                                                // now check the status of the request
                                                $scope.checkId(id);

                                                // there was an error with the POST request
                                            }, function (error) {
                                                console.log("Error" + error.status);
                                                console.log(error);

                                                // temporary display w/o alignment
                                                var seqs = msa.io.fasta.parse(data.join(""));

                                                // the widget settings
                                                var settings = {
                                                    el: document.getElementById("msaDiv"),
                                                    seqs: seqs
                                                };
                                            
                                                // the msa viewing panel
                                                var m = new msa.msa(settings);
                                                m.render();

                                            }); // error }
                                            
                                        } // remaining }
                                    }); // efetch get }
                                }); // for each }


                            } // remaining }

                        }); // get summary }
                    } // id }

                    // status was not successful
                } else {
                    remaining--;
                }
            }); // outer get search
        }); // for each }

    }; // update panel function }

    // used to constantly check the sequence status
    $scope.checkId = function(id) {

                                                
        // check by using a GET request
        $http.get('http://www.ebi.ac.uk/Tools/services/rest/muscle/status/' + id).then(function (response) {
            console.log(response.data);

            // check again if still running
            if (response.data == "RUNNING") {
                $scope.checkId(id);
                return;
            }

            // display the data
            if (response.data == "FINISHED") {

                // the widget settings
                var settings = {
                    el: document.getElementById("msaDiv"),
                };

                // the msa viewing panel
                var m = new msa.msa(settings);

                // data has been aligned, now display it
                msa.u.file.importURL("http://www.ebi.ac.uk/Tools/services/rest/muscle/result/" + id + "/aln-fasta",
                function () {
                    msa.render();
                });

                // there was a problem
            } else {
                console.log(response.data);
            }
        });

    }; // check ID }


    }, // controller function }
    templateUrl: '/static/wiki/js/angular_templates/ortholog-view.html'
});
