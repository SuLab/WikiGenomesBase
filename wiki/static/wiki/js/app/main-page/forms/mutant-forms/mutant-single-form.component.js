angular
    .module('mutantForm')
    .component('mutantForm', {
        bindings: {
            data: '<'
        },

        controller: function (pubMedData, $filter, $location, $routeParams, locusTag2QID, entrez2QID, wdGetEntities, sendToView, RefSeqChrom, appData) {
            var ctrl = this;
            
            appData.getAppData(function (appData) {

                var factory = locusTag2QID;
                if (appData.primary_identifier == "entrez"){
                    factory = entrez2QID;
                }

                factory.getQID($routeParams.locusTag, $routeParams.taxid).then(function (data) {
                    var results = data.data.results.bindings;
                    if (results.length > 0) {
                        ctrl.geneQID = $filter('parseQID')(results[0].gene.value);
                    }

                }).finally(function () {
                    wdGetEntities.wdGetEntities(ctrl.geneQID).then(function (data) {
                        var entity = data.entities[ctrl.geneQID];

                        ctrl.genStart = entity.claims.P644[0].mainsnak.datavalue.value;
                        ctrl.genEnd = entity.claims.P645[0].mainsnak.datavalue.value;

                    });
                });

                if (appData.primary_identifier == "locus_tag") {
                    RefSeqChrom.getRefSeqChromByLocusTag($routeParams.locusTag).then(function(data) {

                        if (data[0]) {
                            ctrl.chromosome = data[0].refSeqChromosome.value;

                            if (ctrl.mutantAnnotation) {
                                ctrl.mutantAnnotation.chromosome = ctrl.chromosome;
                            }
                        }

                    });
                } else {
                    RefSeqChrom.getRefSeqChromByEntrez($routeParams.locusTag).then(function(data) {

                    if (data[0]) {
                        ctrl.chromosome = data[0].refSeqChromosome.value;

                        if (ctrl.mutantAnnotation) {
                            ctrl.mutantAnnotation.chromosome = ctrl.chromosome;
                        }
                    }

                });}

            });

            ctrl.seq_ontology_map = {
      		  "synonymous": "SO:0001815",
      		  "non-synonymous": "SO:0001816",
      		  "non_transcribed_region": "SO:0000183",
      		  "silent_mutation": "SO:0001017",
      		  "stop_gained": "SO:0001587"
            };
              
            ctrl.seq_ontology_list = ["synonymous","non-synonymous","non_transcribed_region","silent_mutation","stop_gained" ];
              
            ctrl.mutant_type_map = {
              	"chemically induced mutation": "EFO_0000370",
              	"transposition": "EFO_0004021",
              	"recombination": "EFO_0004293",
              	"insertion": "EFO_0004016"
            };
              
            ctrl.mutant_type_list = ["chemically induced mutation",	"transposition", "recombination", "insertion" ];
            
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
            
            ctrl.$onInit = function () {
            	
            	ctrl.reftype = "PMID";
            	ctrl.pubtitle = "";
                ctrl.pubauthor = "";
                ctrl.pubdate = "";
                ctrl.pageCount = 0;
                
                var name = null;
                if (ctrl.mutantAnnotation && ctrl.mutantAnnotation.name) {
                	name = ctrl.mutantAnnotation.name;
                }

                ctrl.mutantAnnotation = {
                    taxid: $routeParams.taxid,
                    locusTag: $routeParams.locusTag,
                    coordinate: {},
                    chromosome: ctrl.chromosome,
                    name: name
                };
                
            };
            
            ctrl.resetForm = function () {
            	ctrl.mutantAnnotation.name = null;
                ctrl.$onInit();
            };
            
            // send form data to server to edit wikidata
            ctrl.sendData = function (formData) {
                ctrl.loading = true;
                formData.action = 'annotate';

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
            
            // controls for navigating form
            ctrl.nextClick = function () {
                ctrl.pageCount += 1;
            };
            ctrl.backClick = function () {
                ctrl.pageCount -= 1;
            };
            
            ctrl.changeType = function() {
            	var tmp = ctrl.mutantAnnotation.mutation_name;
            	ctrl.$onInit();
            	ctrl.mutantAnnotation.mutation_name = tmp;
            	ctrl.mutantAnnotation.mutation_id = ctrl.mutant_type_map[tmp];
            };
            
            ctrl.validatePosition = function() {
            	return ctrl.mutantAnnotation.coordinate.start >= ctrl.genStart && ctrl.mutantAnnotation.coordinate.start <= ctrl.genEnd;
            };
            
            ctrl.validateEndPosition = function() {
            	return ctrl.validatePosition() && ctrl.mutantAnnotation.coordinate.end >= ctrl.mutantAnnotation.coordinate.start &&
            		ctrl.mutantAnnotation.coordinate.end <= ctrl.genEnd;
            };
            
            ctrl.validateBase = function() {
            	return (ctrl.mutantAnnotation.ref_base && ctrl.mutantAnnotation.variant_base) &&
            		(ctrl.mutantAnnotation.ref_base != ctrl.mutantAnnotation.variant_base);
            };
            
            ctrl.validateFields = function() {
            	
            	if (!ctrl.mutantAnnotation.name || !ctrl.mutantAnnotation.mutation_name || 
            			(ctrl.reftype == 'DOI' && !ctrl.mutantAnnotation.doi) || 
            			(ctrl.reftype == 'PMID' && !ctrl.mutantAnnotation.pub) || !ctrl.validatePosition()) {
            		return false;
            	}
            	
            	if (ctrl.mutantAnnotation.mutation_name == "chemically induced mutation") {
            		return ctrl.validateBase() && ctrl.mutantAnnotation.snv_name && ctrl.mutantAnnotation.aa_effect;
            	} else if (ctrl.mutantAnnotation.mutation_name == "transposition" || ctrl.mutantAnnotation.mutation_name == "insertion") {
            		return ctrl.mutantAnnotation.percent_gene_intact && ctrl.mutantAnnotation.insert_direction;
            	} else {
            		return ctrl.validateEndPosition() && ctrl.mutantAnnotation.genes_inserted && ctrl.mutantAnnotation.insert_direction;
            	}
            };

        },
        templateUrl: '/static/build/js/angular_templates/mutant-form.min.html'
    });
