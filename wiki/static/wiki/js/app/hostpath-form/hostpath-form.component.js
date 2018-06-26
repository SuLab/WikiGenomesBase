angular
    .module('hostpathForm')
    .component('hostpathForm', {
        bindings: {
            data: '<'
        },
        controller: function ($location, $routeParams, speciesGenes, pubMedData, sendToView, locusTag2QID, $filter) {
            'use strict';
            var ctrl = this;
            
            locusTag2QID.getLocusTag2QID($routeParams.locusTag, $routeParams.taxid).then(function(data) {
                var results = data.data.results.bindings;
                if (results.length > 0) {
                    if (results[0].protein) {
                        ctrl.proteinQID = $filter('parseQID')(results[0].protein.value);
                        ctrl.hostpathAnnotation.proteinQID = ctrl.proteinQID;
                    } 

                }
            });

            ctrl.pageCount = 0;

            ctrl.nextClick = function () {
                ctrl.pageCount += 1;
            };

            ctrl.backClick = function () {
                ctrl.pageCount -= 1;
            };

            ctrl.hostpathAnnotation = {
                proteinQID: ctrl.proteinQID,
                host_species: null
            };

            ctrl.species = [
                {
                    name: 'Homo sapiens',
                    qid: 'Q15978631',
                    taxid: '9606'
                },
                {
                    name: 'Mus musculus',
                    qid: 'Q83310',
                    taxid: '10090'
                }
            ];

            ctrl.determination_methods = [{
                "item": "https://www.wikidata.org/entity/Q32860428",
                "itemLabel": "immunoprecipitation evidence",
                "eco": "ECO:0000085"
            }, {
                "item": "https://www.wikidata.org/entity/Q32860432",
                "itemLabel": "co-localization evidence",
                "eco": "ECO:0001026"
            }];

            ctrl.getSpeciesGenes = function () {
                var taxid = ctrl.hostpathAnnotation.host_species.taxid;
                speciesGenes.getSpeciesGenes(taxid)
                    .then(function (data) {
                        ctrl.speciesGenes = data.data.results.bindings;
                    });
            };
            ctrl.selectProtein = function ($item, $model, $value) {
                ctrl.hostpathAnnotation.host_protein = $item;
            };

            ctrl.getPMID = function (val) {
                return pubMedData.getPMID(val).then(
                    function (data) {
                        var resultData = [data.data.result[val]];
                        return resultData.map(function (item) {
                            return item;
                        });
                    }
                );
            };
            ctrl.selectPub = function ($item, $model, $label) {
                ctrl.pubValue = $item;
            };
            ctrl.sendData = function (formData) {
                ctrl.loading = true;
                
                var url_suf = $location.path().replace("/authorized/", "") + '/wd_hostpath_edit';
                console.log(url_suf);
                
                if (ctrl.proteinQID) {
                	sendToView.sendToView(url_suf, formData).then(function (data) {
                        if (data.data.write_success === true) {
                        	console.log("SUCCESS");
                            console.log(data);
                            alert("Successfully Annotated! Well Done! The annotation will appear here in a few minutes.");
                            ctrl.resetForm();
                        } else if (data.data.authentication === false){
                            console.log("FAILURE: AUTHENTICATION");
                        	console.log(data);
                            alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                        }
                        else {
                        	console.log("FAILURE: UNKNOWN");
                            console.log(data);
                            alert("Something went wrong.  Give it another shot!");
                        }
                    }).finally(function () {
                        ctrl.loading = false;
                    });
                } else {
                	console.log("FAILURE: NO CHLAMYDIA PROTEIN");
                    alert("There doesn't seem to be a protein associated with this gene!");
                }
                
            };
            ctrl.resetForm = function () {
                ctrl.pageCount = 0;
                ctrl.hostpathAnnotation = {
                	proteinQID: ctrl.proteinQID,
                    host_species: null
                };

            };
        },


        templateUrl: '/static/wiki/js/angular_templates/hostpath-form.html'
    });


