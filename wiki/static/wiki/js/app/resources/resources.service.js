//data from /json
angular
    .module('resources')
    .factory('appData', function ($resource) {
        var url = '/static/wiki/json/application_data.json';
        return $resource(url, {}, {
            getAppData: {
                method: "GET",
                params: {},
                cache: true
            }
        });
    });

angular
    .module('resources')
    .factory('taxidFilter', function ($resource, $q) {
        var url = '/static/wiki/json/tax_map.json';
        var data = $resource(url, {}, {
            getTaxMap: {
                method: "GET",
                params: {},
                cache: true
            }
        });
        var name = function(input) {
            var deferred = $q.defer();
            data.getTaxMap(function (data) {
                deferred.resolve(data[input]);
            });
            return deferred.promise;
        };
        var species = function(input) {
            var deferred = $q.defer();
            data.getTaxMap(function (data) {
                deferred.resolve(data[input].split(" ").slice(0, 2).join(" "));
            });
            return deferred.promise;
        };
        var strain = function(input) {
            var deferred = $q.defer();
            data.getTaxMap(function (data) {
                deferred.resolve(data[input].split(" ").slice(2).join(" "));
            });
            return deferred.promise;
        };
        var map = function() {
            var deferred = $q.defer();
            data.getTaxMap(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        };
        return {
            name: name,
            species: species,
            strain: strain,
            map: map
        };
    });

angular
    .module('resources')
    .factory('orgTree', function ($resource) {
        var url = '/static/wiki/json/org_tree.json';
        return $resource(url, {}, {
            getOrgTree: {
                method: "GET",
                params: {},
                cache: true
            }
        });
    });

angular
    .module('resources')
    .factory('allOrgs', function ($resource) {
        var url = '/static/wiki/json/orgsList.json';
        return $resource(url, {}, {
            getAllOrgs: {
                method: "GET",
                params: {},
                isArray: true,
                cache: true
            }
        });
    });

angular
    .module('resources')
    .factory('evidenceCodes', function ($resource) {
        var url = '/static/wiki/json/evidence_codes.json';
        return $resource(url, {}, {
            getevidenceCodes: {
                method: "GET",
                params: {},
                isArray: true,
                cache: true
            }
        });
    });

angular
    .module('resources')
    .factory('mutantData', function ($resource) {
        var url = '/static/wiki/json/kokes.json';
        return $resource(url, {}, {
            getKokesMutants: {
                method: "GET",
                params: {},
                isArray: true,
                cache: true
            }
        });
    });

angular
    .module('resources')
    .factory('expressionTimingData', function ($resource) {
        var url = '/static/wiki/json/expression_timing.json';
        return $resource(url, {}, {
            getExpression: {
                method: "GET",
                params: {},
                isArray: true,
                cache: true
            }
        });
    });

angular
.module('resources')
    .factory('pdbData', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getPdbData = function (uniprot) {
            var url = endpoint + encodeURIComponent(
            		"SELECT ?pdbId ?pmid WHERE {" +
            			  "?protein wdt:P352 '"+uniprot+"'." +
            			  "?protein p:P638 ?pdbClaim." +
            			  "?pdbClaim ps:P638 ?pdbId." +
            			  "?pdbClaim prov:wasDerivedFrom/pr:P248/wdt:P698 ?pmid." +
            			"}"
                );
            return $http.get(url)
                .success(function (response) {
                    return response.data;

                })
                .error(function (response) {
                    return response;
                });
        };
        return {
        	getPdbData: getPdbData
        };


    });

angular
    .module('resources')
    .factory('orthoDataByLocusTag', function ($http, $q) {
        var getOrthologsByLocusTag = function (locusTag) {
            var deferred = $q.defer();
            var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
            var url = endpoint + encodeURIComponent(
                    "SELECT ?orthoLocusTag ?orthoTaxid ?entrez ?uniprot ?refseq ?reference WHERE {" +
                       "{" +
                          "?gene wdt:P2393 '"+locusTag+"'." +
                          "?gene p:P684 ?statement." +
                          "?statement ps:P684 ?ortholog." +
                          "?ortholog wdt:P2393 ?orthoLocusTag." +
                          "?ortholog wdt:P703 ?orthoTaxon." +
                          "?orthoTaxon wdt:P685 ?orthoTaxid." +
                          "OPTIONAL {?ortholog wdt:P351 ?entrez.}" +
                          "?statement prov:wasDerivedFrom/pr:P248 ?reference." +
                          "OPTIONAL {" +
                            "?ortholog wdt:P688 ?protein." +
                            "?protein wdt:P352 ?uniprot." +
                            "?protein wdt:P637 ?refseq." +
                          "}" +
                        "}" +
                        "UNION" +
                        "{" +
                          "?gene wdt:P2393 '"+locusTag+"'." +
                          "?gene wdt:P2393 ?orthoLocusTag." +
                          "?gene wdt:P703 ?orthoTaxon." +
                          "?orthoTaxon wdt:P685 ?orthoTaxid." +
                          "OPTIONAL {?gene wdt:P351 ?entrez.}" +
                          "OPTIONAL {" +
                            "?gene wdt:P688 ?protein." +
                            "?protein wdt:P352 ?uniprot." +
                            "?protein wdt:P637 ?refseq." +
                          "}" +
                        "}" +
                      "}"
                );
            $http.get(url)
            .success(function (response) {
                deferred.resolve(response);
            })
            .error(function (response) {
                deferred.reject(response);
            });
            return deferred.promise;
        };
        return {
            getOrthologs: getOrthologsByLocusTag,
        };
    });

angular
    .module('resources')
    .factory('orthoDataByEntrez', function ($http, $q) {
        var getOrthologsByEntrez = function (entrez) {
            var deferred = $q.defer();
            var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
            var url = endpoint + encodeURIComponent(
                "SELECT ?orthoLocusTag ?orthoTaxid ?entrez ?uniprot ?refseq ?reference WHERE {" +
                "{" +
                "?gene wdt:P351 '"+entrez+"'." +
                "?gene p:P684 ?statement." +
                "?statement ps:P684 ?ortholog." +
                "OPTIONAL {?ortholog wdt:P2393 ?orthoLocusTag.}" +
                "?ortholog wdt:P703 ?orthoTaxon." +
                "?orthoTaxon wdt:P685 ?orthoTaxid." +
                "OPTIONAL {?ortholog wdt:P351 ?entrez.}" +
                "?statement prov:wasDerivedFrom/pr:P248 ?reference." +
                "OPTIONAL {" +
                "?ortholog wdt:P688 ?protein." +
                "?protein wdt:P352 ?uniprot." +
                "?protein wdt:P637 ?refseq." +
                "}" +
                "}" +
                "UNION" +
                "{" +
                "?gene wdt:P351 '"+entrez+"'." +
                "OPTIONAL {?gene wdt:P2393 ?orthoLocusTag.}" +
                "?gene wdt:P703 ?orthoTaxon." +
                "?orthoTaxon wdt:P685 ?orthoTaxid." +
                "OPTIONAL {?gene wdt:P351 ?entrez.}" +
                "OPTIONAL {" +
                "?gene wdt:P688 ?protein." +
                "?protein wdt:P352 ?uniprot." +
                "?protein wdt:P637 ?refseq." +
                "}" +
                "}" +
                "}"
            );
            $http.get(url)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };
        return {
            getOrthologs: getOrthologsByEntrez,
        };
    });

angular
    .module('resources')
    .factory('sendToView', function ($http) {
        var sendToView = function (url_suffix, data) {
            var url = url_suffix;
            return $http.post(url, data)
                .success(function (data) {
                    return data;
                })
                .error(function (data, status) {
                    return status;
                });
        };
        return {
            sendToView: sendToView
        };

    });

angular
    .module('resources')
    .factory('uploadFile', function ($http) {
        var uploadFile = function (url_suffix, data) {
            var url = url_suffix;
            //var config = {
            //  'Content-Type': data.type
            //};
            return $http.post(url, data)
                .success(function (data) {
                    return data;
                })
                .error(function (data, status) {
                    return status;
                });
        };
        return {
            uploadFile: uploadFile
        };

    });


//currently loaded organism
angular
    .module('resources')
    .factory('currentOrgFetch', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getCurrentOrg = function (taxid) {
            var url = endpoint + encodeURIComponent("SELECT ?taxid ?taxon ?taxonLabel" +
                    " WHERE{ ?taxon wdt:P685 '" + taxid + "'. " +
                    "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en' . } }");
            return $http.get(url).then(function (response) {
                var results = response.data.results.bindings;
                return {
                    taxid: taxid,
                    taxon: results[0].taxon.value,
                    taxonLabel: results[0].taxonLabel.value
                };
            });
        };

        return {
            getCurrentOrg: getCurrentOrg
        };


    });
angular
    .module('resources')
    .factory('speciesGenes', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getSpeciesGenes = function (taxid) {
            var url = endpoint + encodeURIComponent("SELECT ?protein ?proteinLabel ?uniprot " +
                    "WHERE{ " +
                    "?taxon wdt:P685 '" + taxid + "'. " +
                    "?protein wdt:P352 ?uniprot;" +
                    "wdt:P703 ?taxon;" +
                    "rdfs:label ?proteinLabel." +
                    "FILTER (lang(?proteinLabel) = \"en\") " +
                    "}"
                );
            console.log(url);
            return $http.get(url)
                .success(function (response) {
                    return response;
                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getSpeciesGenes: getSpeciesGenes
        };
    });


//genes for current organism

angular
    .module('resources')
    .factory('allOrgOperons', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getAllOrgOperons = function (taxid) {
            var url = endpoint + encodeURIComponent(
                    "SELECT ?operon ?operonLabel " +
                    "WHERE{ ?taxon wdt:P685 '" + taxid + "'. " +
                    "?operon wdt:P703 ?taxon; " +
                    "wdt:P279 wd:Q139677. " +
                    "SERVICE wikibase:label { " +
                    "bd:serviceParam wikibase:language 'en' ." +
                    "}" +
                    "} "
                );
            return $http.get(url)
                .success(function (response) {
                    return response;
                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getAllOrgOperons: getAllOrgOperons
        };
    });

//annotations data
angular
  .module('resources')
  .factory('proteinMass', function ($http, $q) {
      var endpoint = 'https://www.uniprot.org/uniprot/{}.xml';
      var getMass = function (uniprot) {
          var url = endpoint.replace("{}", uniprot);
          var deferred = $q.defer();
          $http.get(url)
          .success(function (response) {

              var pattern = /mass="\d+"/;

              return deferred.resolve(response.match(pattern)[0].match(/\d+/)[0]);

          })
          .error(function (response) {
              return deferred.reject(response);
          });
          return deferred.promise;
      };
      return {
          getMass: getMass
      };


  });


//annotations data
angular
    .module('resources')
    .factory('GOTerms', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getGoTerms = function (uniprot) {
            var url = endpoint + encodeURIComponent(
            		"SELECT ?gotermValueLabel ?goID ?gotermValue ?goclass ?reference_retrievedLabel " +
            		  "(GROUP_CONCAT(DISTINCT ?reference_stated_label; SEPARATOR = '; ') AS ?reference_stated_label) " +
            		  "(GROUP_CONCAT(DISTINCT ?determination; SEPARATOR = ';') AS ?determinationLabel) WHERE {" +
            		  "?protein wdt:P352 '" + uniprot + "'." +
            		  "?protein (p:P680|p:P681|p:P682)+ ?goterm." +
            		  "?goterm pq:P459/rdfs:label ?determination. FILTER(LANG(?determination) = 'en')." +
            		  "OPTIONAL { ?goterm (prov:wasDerivedFrom/pr:P248)/rdfs:label ?reference_stated_label. FILTER(LANG(?reference_stated_label) = 'en').}" +
            		  "OPTIONAL { ?goterm (prov:wasDerivedFrom/pr:P813) ?reference_retrieved. }" +
            		  "?goterm (ps:P680|ps:P681|ps:P682)+ ?gotermValue." +
            		  "?gotermValue wdt:P31 ?goclass." +
            		  "?gotermValue wdt:P686 ?goID." +
            		  "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }" +
            		"}" +
            		"GROUP BY ?gotermValueLabel ?goID ?gotermValue ?goclass ?determinationLabel ?reference_retrievedLabel"
                );
            return $http.get(url)
                .success(function (response) {
                    return response.data;

                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getGoTerms: getGoTerms
        };


    });

//annotations data
angular
    .module('resources')
    .factory('ECNumbers', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getECNumbers = function (uniprot) {
            var url = endpoint + encodeURIComponent(
            		  "SELECT ?ecnumber WHERE {" +
            			  "?protein wdt:P352 '" + uniprot + "'." +
                		  "?protein (wdt:P680|wdt:P681|wdt:P682)+ ?gotermValue." +
                		  "?gotermValue wdt:P591 ?ecnumber." +
                		"}"
                );
            return $http.get(url)
                .success(function (response) {
                    return response.data;

                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getECNumbers: getECNumbers
        };


    });

angular
    .module('resources')
    .factory('InterPro', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getInterPro = function (uniprot) {
            var url = endpoint + encodeURIComponent(
                    "SELECT distinct ?protein ?interPro_item ?interPro_label ?ipID ?reference_stated_inLabel ?refURL WHERE {" +
                    "?proteinLabel wdt:P352" +
                    "'" + uniprot + "';" +
                    "p:P527 ?interPro." +
                    "?interPro ps:P527 ?interPro_item." +
                    "?interPro prov:wasDerivedFrom/pr:P248 ?reference_stated_in ;" +  //#where stated
                    "prov:wasDerivedFrom/pr:P854 ?refURL ." + //#reference URL
                    "?interPro_item wdt:P2926 ?ipID;" +
                    "rdfs:label ?interPro_label. " +
                    "SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\" .}" +
                    "filter (lang(?interPro_label) = \"en\") .}"
                );
            return $http.get(url).then(function (response) {
                return response.data.results.bindings;

            });
        };
        return {
            getInterPro: getInterPro
        };


    });

angular
    .module('resources')
    .factory('RefSeqChrom', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getRefSeqChromByLocusTag = function (locusTag) {
            var url = endpoint + encodeURIComponent(
                "SELECT ?refSeqChromosome " +
                "WHERE{ \n" +
                "  ?gene wdt:P2393 " +
                "'"+ locusTag +"';" +
                "        p:P644 ?chr.\n" +
                "  ?chr pq:P1057 ?chromosome. \n" +
                "  ?chromosome wdt:P2249 ?refSeqChromosome.\n" +
                "  SERVICE wikibase:label { bd:serviceParam wikibase:language 'en' .}\n" +
                "} \n"
                );
            return $http.get(url).then(function (response) {
                return response.data.results.bindings;

            });
        };
        var getRefSeqChromByEntrez = function (entrez) {
            var url = endpoint + encodeURIComponent(
                "SELECT ?refSeqChromosome " +
                "WHERE{ \n" +
                "  ?gene wdt:P351 " +
                "'"+ entrez +"';" +
                "        p:P644 ?chr.\n" +
                "  ?chr pq:P1057 ?chromosome. \n" +
                "  ?chromosome wdt:P2249 ?refSeqChromosome.\n" +
                "  SERVICE wikibase:label { bd:serviceParam wikibase:language 'en' .}\n" +
                "} \n"
            );
            return $http.get(url).then(function (response) {
                return response.data.results.bindings;

            });
        };
        return {
            getRefSeqChromByLocusTag: getRefSeqChromByLocusTag,
            getRefSeqChromByEntrez: getRefSeqChromByEntrez
        };


    });

angular
    .module('resources')
    .factory('hostPathogen', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getHostPathogen = function (uniprot) {
            var url = endpoint + encodeURIComponent(
            		"SELECT DISTINCT ?hostGeneLabel ?hostProteinLabel ?hostLabel ?reference_stated_inLabel ?determinationLabel ?pmid WHERE {" +
            			  "?protein wdt:P352 '" + uniprot + "'." +
            			  "?protein p:P129 ?hpClaim." +
            			  "?hpClaim (prov:wasDerivedFrom/pr:P248) ?reference_stated_in." +
            			  "?hpClaim pq:P459 ?determination." +
            			  "?reference_stated_in wdt:P698 ?pmid." +
            			  "?hpClaim ps:P129 ?hostProtein." +
            			  "?hostProtein wdt:P703 ?host." +
            			  "?hostProtein wdt:P702 ?hostGene." +
            			  "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }" +
            			"}"
                );

            return $http.get(url).then(function (response) {
                return response.data.results.bindings;
            });
        };
        return {
            getHostPathogen: getHostPathogen
        };


    });

angular
.module('resources')
.factory('tax2QID', function ($http) {
    var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
    var getQID = function (taxid) {
        var url = endpoint + encodeURIComponent(
        		"SELECT ?taxon WHERE {" +
				  "?taxon wdt:P685 '"+taxid+"'." +
				"}"
            );

        return $http.get(url).then(function (response) {
            return response.data.results.bindings;
        });
    };
    return {
    	getQID: getQID
    };


});

angular
	.module('resources')
	.factory('annotationSettings', function($http){
		var getSettings = function() {
			return $http.get("/static/wiki/json/module_settings.json").then(function(response) {
				return response;
			});
		};

		return {
			getSettings: getSettings
		};
	});

angular
    .module('resources')
    .factory('OperonData', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getOperonDataByLocusTag = function (locusTag) {
            var url = endpoint + encodeURIComponent(
            		"SELECT ?operonItemLabel ?op_genesLabel ?locusTag ?entrez ?genStart ?genEnd ?strandLabel ?reference_stated_inLabel ?reference_pmid WHERE {" +
            			  "?gene wdt:P2393 '"+locusTag+"';" +
            			  "      p:P361 ?operon." +
            			  "?operon ps:P361 ?operonItem;" +
                          "        (prov:wasDerivedFrom/pr:P248) ?reference_stated_in." +
            			  "?operonItem wdt:P31 wd:Q139677;" +
            			  "            wdt:P527 ?op_genes." +
            			  "?op_genes wdt:P2393 ?locusTag;" +
            			  "          wdt:P351 ?entrez;" +
            			  "          wdt:P644 ?genStart;" +
            			  "          wdt:P645 ?genEnd;" +
            			  "          wdt:P2548 ?strand." +
            			  "?reference_stated_in wdt:P698 ?reference_pmid." +
            			  "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }" +
            			"}"
                );
            return $http.get(url)
                .success(function (response) {
                    return response.data;

                })
                .error(function (response) {
                    return response;
                });
        };
        var getOperonDataByEntrez = function (entrez) {
            var url = endpoint + encodeURIComponent(
                "SELECT ?operonItemLabel ?op_genesLabel ?locusTag ?entrez ?genStart ?genEnd ?strandLabel ?reference_stated_inLabel ?reference_pmid WHERE {" +
                "?gene wdt:P351 '"+entrez+"';" +
                "      p:P361 ?operon." +
                "?operon ps:P361 ?operonItem;" +
                "        (prov:wasDerivedFrom/pr:P248) ?reference_stated_in." +
                "?operonItem wdt:P31 wd:Q139677;" +
                "            wdt:P527 ?op_genes." +
                "?op_genes wdt:P2393 ?locusTag;" +
                "          wdt:P351 ?entrez;" +
                "          wdt:P644 ?genStart;" +
                "          wdt:P645 ?genEnd;" +
                "          wdt:P2548 ?strand." +
                "?reference_stated_in wdt:P698 ?reference_pmid." +
                "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }" +
                "}"
            );
            return $http.get(url)
                .success(function (response) {
                    return response.data;

                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getOperonDataByLocusTag: getOperonDataByLocusTag,
            getOperonDataByEntrez: getOperonDataByEntrez
        };
    });

angular
	.module('resources')
	.factory('geneSequenceData', function($http, $q) {
    'use strict';

    var getSequence = function(value) {

        var deferred = $q.defer();

        // first get the UID from the nuccore database
        $http.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=' + value).success(function(response) {

            // data in string as xml, find the ID
            var xml = response;
            if (xml.includes("<Id>")) {

                // extract the id
                var id = xml.substring(xml.indexOf("<Id>") + 4, xml.indexOf("</Id>"));

                // now that we have the ID, get the start and stop from the summary
                $http.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=' + id).success(function(resp) {

                    // the response is in xml again, take out the stop and start sequences
                    xml = resp;
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
                    $http.get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=" + accession + "&seq_start=" + start + "&seq_stop=" + stop + "&strand=" + strand + "&rettype=fasta").success(function(r) {

                        // get the human readable name
                        var first = ">" + value + "\n";
                        var body = r.substring(r.indexOf("\n") + 1, r.length).replace(/\n/g, "");

                        // the sequence of the gene
                        deferred.resolve(first + body);

                    }).error(function(response) {
                        deferred.reject(response);
                    });
                }).error(function(response) {
                    deferred.reject(response);
                });
            }
        });

        // return future gene sequence
        return deferred.promise;

    };

    return {
        getSequence : getSequence
    };
});

angular
	.module('resources')
	.factory('proteinSequenceData', function($http, $q) {
    'use strict';

    // value = ref seq ID of protein
    var getSequence = function(refseq) {

        var deferred = $q.defer();

        if (refseq) {

            // first get the UID from the nuccore database
            $http.get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=protein&id=" + refseq + "&rettype=fasta")

                // success
                .then(function(response) {

                    var fasta = response.data;

                    // parse out strain name
                    var data = ">" + refseq + "\n" + fasta.substring(fasta.indexOf("\n") + 1).replace(/\n/g, "");

                    deferred.resolve(data);

                // error
                }, function(response) {
                    console.log("Error reading protein sequence");
                    deferred.reject(response);
                });
        } else {
            console.log("No Ref Seq ID");
            deferred.reject();
        }

        // return future gene sequence
        return deferred.promise;

    };

    return {
        getSequence : getSequence
    };
});

angular
    .module('resources')
    .factory('expasyData', function ($http, $location) {

        var expasy_endpoint = "https://" + $location.host() + "/expasy/EC/{ecnumber}.txt";

        var getReactionData = function (ecNumber) {
            var url = expasy_endpoint.replace('{ecnumber}', ecNumber);
            return $http.get(url).then(
                function successCallback(response) {
                    var reactionData = {
                        reaction: []
                    };
                    var responseData = response.data.split("\n");
                    angular.forEach(responseData, function (value, key) {

                        if (value.match("^ID")) {
                            reactionData.ecnumber = value.slice(5);
                        }
                        if (value.match("^CA ")) {
                            var trimmedReaction = value.replace(/^(CA)/, "");
                            reactionData.reaction.push(trimmedReaction);
                        }

                    });
                    return reactionData;

                },
                function errorCallbackResponse(response) {
                    return response;
                }
            );
        };
        return {
            getReactionData: getReactionData
        };


    });

angular
    .module('resources')
    .factory('pubMedData', function ($http) {
        var getPMID = function (val) {
            var endpoint = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=';
            var url = endpoint + val;
            return $http.get(url)
                .success(function (response) {
                    return response.result[val];
                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getPMID: getPMID
        };
    });


angular
    .module('resources')
    .factory('locusTag2Pub', function ($http) {
        var getlocusTag2Pub = function (val) {
            var endpoint = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=chlamydia%20{locusTag}&format=json';
            var url = endpoint.replace('{locusTag}', val);
            return $http.get(url)
                .success(function (response) {
                    return response;
                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getlocusTag2Pub: getlocusTag2Pub
        };
    });



angular
    .module('resources')
    .factory('euroPubData', function ($http) {
        var getEuroPubData = function (val) {
            var endpoint = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query={pubmedID}&resulttype=core&format=json';
            var url = endpoint.replace('{pubmedID}', val);
            return $http.get(url)
                .success(function (response) {
                    return response;
                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getEuroPubData: getEuroPubData
        };
    });

angular
    .module('resources')
    .factory('pubLinks', function ($http) {
        var getPubLinks = function (entrez) {
            var endpoint = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=gene&db=pubmed&id={entrez}&retmode=json&linkname=gene_pubmed_pmc_nucleotide';

            var url = endpoint.replace('{entrez}', entrez);
            return $http.get(url)
                .success(function (response) {
                    return response;
                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getPubLinks: getPubLinks
        };
    });

angular
    .module('resources')
    .factory('recentPubLinks', function ($http) {
        var getRecentPubLinks = function (term, days, max) {
            var url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=' + term +
                '&reldate='+days+'&datetype=edat&retmax='+max+'&usehistory=y&retmode=json';
            return $http.get(url)
                .success(function (response) {
                    return response;
                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getRecentPubLinks: getRecentPubLinks
        };
    });

angular
    .module('resources')
    .factory('allGoTerms', function ($http) {
        var getGoTermsAll = function (val, goClass) {
            var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
            var url = endpoint + encodeURIComponent("SELECT DISTINCT ?goterm ?goID ?goterm_label " +
                    "WHERE { ?goterm wdt:P279* wd:" + goClass + "; " +
                    "rdfs:label ?goterm_label; wdt:P686 ?goID. " +
                    "FILTER(lang(?goterm_label) = 'en') " +
                    "FILTER(CONTAINS(LCASE(?goterm_label), '" +
                    val.toLowerCase() + "' ))}"
                );

            return $http.get(url)
                .success(function (response) {
                    return response.data;
                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getGoTermsAll: getGoTermsAll
        };

    });

angular
    .module('resources')
    .factory('developmentalForm', function ($http) {
        var getDevelopmentalForms = function (uniprot) {
            var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
            var url = endpoint + encodeURIComponent(
                "SELECT (GROUP_CONCAT(?eb) AS ?eb) (GROUP_CONCAT(?rb) AS ?rb) ?pmid (GROUP_CONCAT(?increased) AS ?increased) WHERE {" +
                    "?protein wdt:P352 '"+uniprot+"'." +
                    "?protein p:P5572+ ?claim." +
                    "?claim ps:P5572 ?form." +
                    "?claim prov:wasDerivedFrom/pr:P248/wdt:P698 ?pmid." +
                "BIND(IF(?form = wd:Q51955212, '+', '') AS ?eb)." +
                "BIND(IF(?form = wd:Q51955198, '+', '') AS ?rb)." +
                "OPTIONAL {" +
                        "?protein wdt:P1911 ?form." +
                    "BIND(IF(?form = wd:Q51955212, 'eb', 'rb') AS ?increased)." +
                "}" +
            "}" +
            "GROUP BY ?pmid"
            );

            return $http.get(url)
                .success(function (response) {
                    return response.data;
                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getDevelopmentalForms: getDevelopmentalForms
        };

    });

angular
    .module('resources')
    .factory('allOrgGenes', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getAllOrgGenes = function (taxid) {
            var url = endpoint + encodeURIComponent(
                "SELECT REDUCED ?gene ?geneLabel ?entrez ?locusTag WHERE { " +
                    "?taxon wdt:P685 '" + taxid + "'. " +
                    "?gene wdt:P703 ?taxon; " +
                    "      wdt:P279|wdt:P31 wd:Q7187; " +
                    "      wdt:P2393 ?locusTag." +
                    "OPTIONAL {?gene wdt:P351 ?entrez.} " +
                    "SERVICE wikibase:label {bd:serviceParam wikibase:language 'en' . }" +
                "}" +
                "ORDER BY ASC(?locusTag)"
            );
            return $http.get(url)
                .success(function (response) {
                    return response;
                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getAllOrgGenes: getAllOrgGenes
        };
    });

angular
    .module('resources')
    .factory('allSpeciesGenes', function ($http) {

        var getAllSpeciesGenes = function (parentTaxid) {
            var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
            var url = endpoint + encodeURIComponent(
                "SELECT REDUCED ?taxid ?taxonLabel ?gene ?geneLabel ?geneAltLabel ?locusTag " +
                "?entrez ?uniprot ?refseq_prot ?pdb ?mfLabel ?bpLabel ?ccLabel ?host_proteinLabel WHERE {" +
                "?taxon (wdt:P171*/wdt:P685) '" + parentTaxid + "';" +
                "   wdt:P685 ?taxid." +
                "?gene wdt:P703 ?taxon;" +
                "   (wdt:P279|wdt:P31) wd:Q7187;" +
                "   wdt:P2393 ?locusTag." +
                "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }}");
            return $http.get(url)
                .success(function (response) {
                	var genes = response.results.bindings;
            		var pattern = /(\w{2,4})_?(RS)?\d+/;
            		angular.forEach(genes, function(gene) {
            			var value = gene.geneLabel.value;
            			var locusTag = value.match(pattern)[0];

            			// add locus without _
            			if (value.indexOf("_") != -1) {
            				gene.geneLabel.value += "/" + locusTag.replace("_", "");
            			}

            			// add locus without beginning 0s in number
            			var prefix = locusTag.match(/(\w{2,4})_?(RS)?/)[0];
            			var num = parseInt(locusTag.substring(prefix.length));
            			gene.geneLabel.value += "/" + prefix + num;

            			if (prefix.indexOf("_") != -1) {
            				gene.geneLabel.value += "/" + prefix.replace("_", "") + num;
            			}
            		});
                    return genes;
                })
                .error(function (response) {
                    return response;
                });
        };
        var getAllSpeciesGeneLabels = function (parentTaxid) {
            var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
            var url = endpoint + encodeURIComponent(
                    "SELECT DISTINCT ?geneLabel ?locusTag ?taxid ?symbol ?entrez WHERE { " +
                        "?taxon wdt:P171+/wdt:P685 '" + parentTaxid + "'." +
                        "?gene wdt:P703 ?taxon;" +
                            "wdt:P279|wdt:P31 wd:Q7187;" +
            			    "wdt:P2393 ?locusTag." +
            			"?taxon wdt:P685 ?taxid. " +
                        "OPTIONAL {?gene wdt:P2561 ?symbol}" +
                        "OPTIONAL {?gene wdt:P351 ?entrez}" +
            			"SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }" +
        			"}");
            return $http.get(url)
                .success(function (response) {
                	var genes = response.results.bindings;
            		var pattern = /(\w{2,4})_?(RS)?\d+/;
            		angular.forEach(genes, function(gene) {

                        var value = gene.geneLabel.value;
            			var locusTag = value.match(pattern)[0];
            			// add locus without _
            			if (value.indexOf("_") != -1) {
            				gene.geneLabel.value += "/" + locusTag.replace("_", "");
            			}

            			// add locus without beginning 0s in number
            			var prefix = locusTag.match(/(\w{2,4})_?(RS)?/)[0];
            			var num = parseInt(locusTag.substring(prefix.length));
            			gene.geneLabel.value += "/" + prefix + num;

            			if (prefix.indexOf("_") != -1) {
            				gene.geneLabel.value += "/" + prefix.replace("_", "") + num;
            			}

                        if (gene.symbol) {
                            var symbol = gene.symbol.value;
                            if (gene.geneLabel.value.toLowerCase().indexOf(symbol.toLowerCase()) == -1) {
                                gene.geneLabel.value += " (" + symbol + ")";
                            }
                        }
            		});
                    return genes;
                })
                .error(function (response) {
                    return response;
                });
        };
        return {
            getAllSpeciesGenes: getAllSpeciesGenes,
            getAllSpeciesGeneLabels: getAllSpeciesGeneLabels
        };
    });

angular
    .module('resources')
    .factory('wdGetEntities', function () {
        var wdGetEntities = function (qid) {
            return $.ajax({
                url: "https://www.wikidata.org/w/api.php",
                jsonp: "callback",
                dataType: 'jsonp',
                data: {
                    action: "wbgetentities",
                    ids: qid,
                    format: "json"
                },
                xhrFields: {withCredentials: true},
                success: function (response) {
                    return response;
                },
                error: function (response) {
                    return response;
                }
            });
        };
        return {
            wdGetEntities: wdGetEntities

        };
    });


angular
    .module('resources')
    .factory('entrez2QID', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getEntrez2QID = function (entrez, taxid) {
            var query = "SELECT distinct ?gene ?protein WHERE{" +
                "?gene wdt:P351 '{entrez}'. " +
                "OPTIONAL {?gene wdt:P688 ?protein.}}";
            var url = endpoint + encodeURIComponent(query.replace('{entrez}', entrez));
            return $http.get(url)
                .success(function (response) {
                    return response;
                })
                .error(function (response) {
                    return response;
                });

        };
        return {
            getQID: getEntrez2QID
        };


    });

angular
    .module('resources')
    .factory('locusTag2QID', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getLocusTag2QID = function (locusTag, taxid) {
            var query = "SELECT distinct ?gene ?protein WHERE{" +
                "?strain wdt:P685 '{taxid}'. " +
                "?gene wdt:P2393 '{locusTag}'; " +
                "wdt:P703 ?strain. " +
                "OPTIONAL {?gene wdt:P688 ?protein.}}";
            var url1 = query.replace('{taxid}', taxid).replace('{locusTag}', locusTag);
            var url = endpoint + encodeURIComponent(url1);
            return $http.get(url)
                .success(function (response) {
                    return response;

                })
                .error(function (response) {

                    return response;
                });

        };
        return {
            getQID: getLocusTag2QID
        };


    });


angular
    .module('resources')
    .factory('abstractSPARQL', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getAbstractSPARQL = function (pqid, pred, idprop) {
            var preq = "PREFIX wd: <https://www.wikidata.org/entity/> " +
                "PREFIX prov: <https://www.w3.org/ns/prov#> " +
                "PREFIX pr: <https://www.wikidata.org/prop/reference/> " +
                "PREFIX p: <https://www.wikidata.org/prop/> " +
                "PREFIX ps: <https://www.wikidata.org/prop/statement/> " +
                "SELECT (wd:prot_qid as ?sub) " +
                "?obj ?objLabel ?objDescription ?obj_id " +
                "?stated_in ?stated_inLabel " +
                "?retrieved " +
                "?reference_url " +
                "?language ?languageLabel " +
                "?curator ?curatorLabel " +
                "?determination ?determinationLabel " +
                "WHERE { " +
                " wd:prot_qid p:an_prop ?claim . " +
                " ?claim ps:an_prop ?obj. " +
                " ?obj wdt:id_prop ?obj_id. " +
                "  optional {?claim prov:wasDerivedFrom/pr:P248 ?stated_in. } " +
                "  optional {?claim prov:wasDerivedFrom/pr:P813 ?retrieved. } " +
                "  optional {?claim prov:wasDerivedFrom/pr:P854 ?reference_url. } " +
                "  optional {?claim prov:wasDerivedFrom/pr:P407 ?language. } " +
                "  optional {?claim prov:wasDerivedFrom/pr:P1640 ?curator. } " +
                "  optional {?claim pq:P459 ?determination. } " +
                "  SERVICE wikibase:label { " +
                "        bd:serviceParam wikibase:language 'en' ." +
                "  } " +
                "}";

            var url1 = preq.replace(/prot_qid/g, pqid).replace(/an_prop/g, pred).replace(/id_prop/g, idprop);
            var url = endpoint + encodeURIComponent(url1);
            console.log(url1);
            return $http.get(url)
                .success(function (response) {
                    return response;
                })
                .error(function (response) {

                    return response;
                });
        };
        return {
            getAbstractSPARQL: getAbstractSPARQL
        };


    });