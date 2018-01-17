angular.module('orthologView')

    .component('orthologView',
        {
            bindings : {
                data : '<'
            },
            controller : "OrthologCtrl",
            templateUrl : '/static/wiki/js/angular_templates/ortholog-view.html'
        })

    .factory('alignOrthologData', function($http, $interval) {

        // data in form of array of sequences
        var align = function(data) {

            // data to send to muscle
            var content = {
                "email" : "djow@ucsd.edu",
                "title" : "ortholog alignment",
                "format" : "fasta",
                "tree" : "tree1",
                "order" : "aligned",
                "sequence" : data.join("\n")
            };

            // submit POST to MUSCLE
            $http({
                method : 'POST',
                url : 'http://www.ebi.ac.uk/Tools/services/rest/muscle/run/',
                data : JSON.stringify(content),
                headers : {
                    'Content-Type' : 'text/plain;charset=UTF-8'
                }
            }).success(function(response) {

                // JOB ID for muscle
                var id = response.data;
                console.log("Job ID:" + id);

                // check every 3 seconds for 10 attempts
                $interval(checkId(id), 3000, 10);

            // there was an error with the POST request
            }).error(function(response) {
                console.log("POST TO MUSCLE Error" + response.status);
                console.log(response);

                // display w/o alignment
                var seqs = msa.io.fasta.parse(data.join("\n"));

                // the widget settings
                var settings = {
                    el : document
                        .getElementById("msaDiv"),
                    seqs : seqs
                };

                // the msa viewing panel
                var m = new msa.msa(settings);
                m.render();
            });
        };

        // used to constantly check the sequence status
        var checkId = function(id) {

            // check by using a GET request
            $http.get('http://www.ebi.ac.uk/Tools/services/rest/muscle/status/' + id).then(
                function(response) {
                    console.log(response.data);

                    // check again if still running
                    if (response.data == "RUNNING") {
                        return;
                    }

                    // display the data
                    if (response.data == "FINISHED") {

                        // the widget settings
                        var settings = {
                            el : document
                                .getElementById("msaDiv"),
                        };

                        // the msa viewing panel
                        var m = new msa.msa(settings);

                        // data has been aligned, now display it
                        msa.u.file.importURL("http://www.ebi.ac.uk/Tools/services/rest/muscle/result/" + id + "/aln-fasta",
                            function() {
                                msa.render();
                            });
                        
                        // cancel the interval
                        $interval.cancel();

                    // there was a problem
                    } else {
                        console.log("ERROR: " + response.data);
                    }
                });

        };

    })

    .factory('geneSequenceData', function($http) {

        var getSequence = function(value) {

            // first get the UID from the nuccore database
            $http.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=' + value).success(function(response) {

                // data in string as xml, find the ID
                var xml = response.data;
                if (xml.includes("<Id>")) {

                    // extract the id
                    var id = xml.substring(xml.indexOf("<Id>") + 4, xml.indexOf("</Id>"));

                    // now that we have the ID, get the start and stop from the summary
                    $http.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=' + id).success(function(resp) {

                        // the response is in xml again, take out the stop and start sequences
                        xml = resp.data;
                        var start = parseInt(xml.substring(xml.indexOf("<ChrStart>") + 10, xml.indexOf("</ChrStart>"))) + 1;
                        var stop = parseInt(xml.substring(xml.indexOf("<ChrStop>") + 9, xml.indexOf("</ChrStop>"))) + 1;
                        var accession = xml.substring(xml.indexOf("<ChrAccVer>") + 11, xml.indexOf("</ChrAccVer>"));

                        // which strand to use
                        var strand = 1;

                        if (start > stop) {

                            // strand 2 when start > stop
                            strand = 2;

                            // now swap the start and stop
                            var temp = start;
                            start = stop;
                            stop = temp;
                        }

                        // now do the efetch
                        $http.get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id="
                            + accession + "&seq_start=" + start + "&seq_stop=" + stop + "&strand=" + strand + "&rettype=fasta").success(function(r) {

                            // get the human readable name
                            var first = ">" + r.data.substring(r.data.indexOf("Chlamydia") + 10, r.data.indexOf("\n") + 1);
                            first = first.replace(" ", "-");
                            var body = r.data.substring(r.data.indexOf("\n") + 1, r.data.length).replace(/\n/g, "");

                            // the sequence of the gene
                            return first + body;

                        }).error(function(response) {
                        	return null;
                        });
                    }).error(function(response) {
                    	return null;
                    });
                }
            });

        };
    })

    .controller('orthologView', function($scope, geneSequenceData, alignOrthologData) {

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

            // holds gene sequence data
            var data = [];

            // get the sequence data based on ncbi
            angular.forEach($scope.selected, function(value) {
                var seq = geneSequenceData.getSequence(value);
                if (seq != null) {
                    data.push(seq);
                }
            });

            // now align it
            alignOrthologData.align(data);

        };

    });