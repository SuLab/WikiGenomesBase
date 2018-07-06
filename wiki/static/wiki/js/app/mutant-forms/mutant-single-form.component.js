angular
    .module('mutantForm')
    .component('mutantForm', {
        bindings: {
            data: '<'
        },

        controller: function (pubMedData, $filter, $location, $routeParams, locusTag2QID, wdGetEntities, sendToView) {
            var ctrl = this;
            
            ctrl.$onInit = function () {
            	
            	ctrl.reftype = "PMID";
            	ctrl.pubtitle = "";
                ctrl.pubauthor = "";
                ctrl.pubdate = "";

                ctrl.mutantAnnotation = {
                    taxid: $routeParams.taxid,
                    locusTag: $routeParams.locusTag,
                    chromosome: null,
                    name: null,
                    mutant_type: {
                        "alias": null,
                        "name": null,
                        "id": null,
                        "key": null
                    },
                    coordinate: {
                        start: null
                    },
                    percent_gene_intact: null,
                    insert_direction: null,
                    pub: null,
                    doi: null,
                    ref_base: null,
                    variant_base: null,
                    variant_type: {alias: null, name: null, id: null},
                    aa_effect: null
                };
                ctrl.pageCount = 0;
                locusTag2QID.getLocusTag2QID(ctrl.mutantAnnotation.locusTag, ctrl.mutantAnnotation.taxid).then(function (data) {
                    var results = data.data.results.bindings;
                    if (results.length > 0) {
                        ctrl.geneQID = $filter('parseQID')(results[0].gene.value);
                    }

                }).finally(function () {
                    wdGetEntities.wdGetEntities(ctrl.geneQID).then(function (data) {
                        var entity = data.entities[ctrl.geneQID];
                        
                        ctrl.genStart = entity.claims.P644[0].mainsnak.datavalue.value;
                        ctrl.genEnd = entity.claims.P645[0].mainsnak.datavalue.value;
                        
                        if (entity.claims.P644[0].qualifiers.P1057) {
                        	ctrl.mutantAnnotation.chromosome = entity.claims.P644[0].qualifiers.P1057[0].datavalue.value;
                        } else if (entity.claims.P644[0].qualifiers.P2249) {
                        	ctrl.mutantAnnotation.chromosome = entity.claims.P644[0].qualifiers.P2249[0].datavalue.value;
                        }
                    });
                });

                //controls for navigating form
                ctrl.nextClick = function () {
                    ctrl.pageCount += 1;
                };
                ctrl.backClick = function () {
                    ctrl.pageCount -= 1;
                };

                ctrl.seq_ontology_map = [
                    {
                        alias: 'SYNONYMOUS',
                        name: 'synonymous',
                        id: 'SO:0001814'
                    },
                    {
                        alias: 'Non-neutral',
                        name: 'non-synonymous',
                        id: 'SO:0001816'
                    },
                    {
                        alias: 'NON-CODING',
                        name: 'non_transcribed_region',
                        id: 'SO:0000183'
                    },
                    {
                        alias: 'Neutral',
                        name: 'silent_mutation',
                        id: 'SO:0001017'
                    },
                    {
                        alias: 'NONSENSE',
                        name: 'stop_gained',
                        id: 'SO:0001017'
                    }

                ];

                ctrl.mutant_type_map = [
                    {
                        alias: 'chemical mutagenesis',
                        name: 'chemically induced mutation',
                        id: 'EFO_0000370',
                        key: 1
                    },
                    {
                        alias: 'transposon mutagenesis',
                        name: 'tbd',
                        id: 'tbd',
                        key: 2
                    }
                ];


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
                    ctrl.mutantAnnotation.pub = $item.uid;
                    ctrl.pubtitle = $item.title;
                    ctrl.pubauthor = $item.authors[0].name;
                    ctrl.pubdate = $item.pubdate;
                };

                ctrl.resetForm = function () {
                    ctrl.$onInit();
                };

                //send form data to server to edit wikidata
                ctrl.sendData = function (formData) {
                    ctrl.loading = true;
                    formData.action = 'annotate';
                    
                    if (!$location.path().includes("authorized")) {
                    	alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                    	return;
                    }
                    
                    var url_suf = $location.path().replace("/authorized/", "") + '/wd_mutant_edit';
                    console.log(url_suf);
                    sendToView.sendToView(url_suf, formData).then(function (data) {
                    	if (data.data.write_success === true) {
                        	console.log("SUCCESS");
                            console.log(data);
                            alert("Successfully Annotated! Well Done! The annotation will appear here soon.");
                            ctrl.resetForm();
                        } else if (data.data.authentication === false){
                            console.log("FAILURE: AUTHENTICATION");
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

                };
                
                ctrl.validatePosition = function() {
                	return ctrl.mutantAnnotation.coordinate.start >= ctrl.genStart && ctrl.mutantAnnotation.coordinate.start <= ctrl.genEnd;
                };
                
                ctrl.validateBase = function() {
                	return (ctrl.mutantAnnotation.ref_base && ctrl.mutantAnnotation.variant_base) &&
                		(ctrl.mutantAnnotation.ref_base != ctrl.mutantAnnotation.variant_base);
                };
                
                ctrl.validateFields = function() {
                	
                	if (!ctrl.mutantAnnotation.name || !ctrl.mutantAnnotation.mutant_type || 
                			(ctrl.reftype == 'DOI' && !ctrl.mutantAnnotation.doi) || 
                			(ctrl.reftype == 'PMID' && !ctrl.mutantAnnotation.pub) || !ctrl.validatePosition()) {
                		return false;
                	}
                	
                	if (ctrl.mutantAnnotation.mutant_type.key == 1) {
                		return ctrl.validateBase() && ctrl.mutantAnnotation.variant_type && ctrl.mutantAnnotation.aa_effect;
                	} else {
                		return ctrl.mutantAnnotation.percent_gene_intact && ctrl.mutantAnnotation.insert_direction;
                	}
                };
            };

        },
        templateUrl: '/static/build/js/angular_templates/mutant-form.min.html'
    });
