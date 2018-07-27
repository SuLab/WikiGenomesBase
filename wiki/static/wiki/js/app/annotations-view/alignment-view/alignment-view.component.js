angular.module("alignmentView")

    .controller("alignmentCtrl", function(orthoData, geneSequenceData, alignOrthologData, proteinSequenceData) {
        'use strict';
        var ctrl = this;


        // initial variable setup
        ctrl.projection = {};
        ctrl.type = "dna";
        ctrl.alignMessage = "Aligning Orthologs. Please be patient.";
        ctrl.citation = false;
        ctrl.isRendered = false;

        // Get ortholog data from wikidata
        ctrl.data = {};
        orthoData.getOrthologs(ctrl.locusTag).then(function(response) {

            // now add results from sparql query
            angular.forEach(response.results.bindings, function(obj) {
                var tax = obj.orthoTaxid.value;
                var tag = obj.orthoLocusTag.value;
                ctrl.hasOrthologs = true;
                ctrl.projection[tax] = true;
                var refseq = obj.refseq ? obj.refseq.value : "";
                ctrl.data[tax] = [ tag, refseq ];
            });

        });

        // for selecting from the check list
        ctrl.select = function(checked, value) {
            ctrl.projection[value] = checked;
        };

        // function to update the selected list and align after
        ctrl.alignData = function() {

            // holds gene sequence data
            var data = [];
            var index = 0;

            // get the sequence data based on ncbi
            //key = taxid, value = true/false
            angular.forEach(ctrl.projection, function(value, key) {
                if (value) {
                    var promise;
                    if (ctrl.type == "dna") {
                        promise = geneSequenceData.getSequence(ctrl.data[key][0]);
                    } else {
                        promise = proteinSequenceData.getSequence(ctrl.data[key][1]);
                    }
                    promise.then(function(seq) {
                        index++;
                        data.push(seq);

                        if (index == Object.keys(ctrl.projection).length) {
                            ctrl.aligning = true;

                            // now align it
                            alignOrthologData.align(data, ctrl);
                            ctrl.citation = true;
                        }
                    }, function(error) {
                        index++;
                        ctrl.aligning = false;
                    });
                } else {
                    index++;
                }
            });

        };

    })

    .factory('alignOrthologData', function($http, $timeout, $sce) {

        'use strict';

        // data in form of array of sequences
        var align = function(data, ctrl) {

            // submit POST request
            $http.get("alignOrthologs?sequence=" + encodeURIComponent(data.join("\n")) + "&length=" + encodeURIComponent(data.length)).then(function(response) {
                // JOB ID for muscle
                var id = response.data.id;
                console.log("Job ID:" + id);

                // now repeatedly check the status
                checkId(id, ctrl);
            }, function(response) {
                ctrl.aligning = false;
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
                ctrl.isRendered = true;
            });
        };

        // used to constantly check the sequence status
        var checkId = function(id, ctrl) {

            // check by using a GET request
            $http.get('https://www.ebi.ac.uk/Tools/services/rest/muscle/status/' + id).then(
                function(response) {
                    console.log(response.data);

                    // check again if still running
                    if (response.data == "RUNNING") {
                        $timeout(checkId(id, ctrl), 2000);
                        return;
                    }

                    // display the data
                    if (response.data == "FINISHED") {

                        ctrl.aligning = false;

                        // the widget settings
                        var settings = {
                            el : document
                                .getElementById("msaDiv"),
                        };

                        // the msa viewing panel
                        var m = new msa.msa(settings);

                        // data has been aligned, now display it
                        m.u.file.importURL("https://www.ebi.ac.uk/Tools/services/rest/muscle/result/" + id + "/aln-fasta",
                            function() {
                                m.render();
                            }
                        );

                        ctrl.isRendered = true;
                        ctrl.alignmentURL = $sce.trustAsResourceUrl("https://www.ebi.ac.uk/Tools/services/rest/muscle/result/" + id + "/aln-fasta");

                    // there was a problem
                    } else {
                        console.log("ERROR: " + response.data);
                        ctrl.aligning = false;
                    }
                });

        };

        return {
            align : align
        };

    })

    .component("alignmentView", {
        controller : "alignmentCtrl",
        templateUrl : "/static/build/js/angular_templates/alignment-view.min.html",
        bindings : {
            locusTag : '<',
            taxId : '<',
            allorggenes : '<'
        },
    });