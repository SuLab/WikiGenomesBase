//data from /json

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
    .factory('allChlamOrgs', function ($resource) {
        var url = '/static/wiki/json/chlamsOrgList.json';
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
    .factory('orthoData', function ($http, $q) {
        var getOrthologs = function (locusTag) {
            var deferred = $q.defer();
            var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
            var url = endpoint + encodeURIComponent("SELECT ?orthoLocusTag ?orthoTaxid " +
                    "WHERE{ " +
                    "?gene wdt:P2393 '" + locusTag + "';" +
                    "wdt:P684 ?ortholog." +
                    "?ortholog wdt:P2393 ?orthoLocusTag;" +
                    "wdt:P703 ?orthoTaxon." +
                    "?orthoTaxon wdt:P685 ?orthoTaxid." +
                    "}"
                );
            $http.get(url)
            .success(function (response) {
                deferred.resolve(response);
            })
            .error(function (response) {
                deferred.reject(response);
            })
            return deferred.promise;
        };
        return {
            getOrthologs: getOrthologs
        }
    });

//server communication
angular
    .module('resources')
    .factory('appData', function ($resource) {
        console.log('resources appData');
        var url = '/static/wiki/json/appData.json';
        return $resource(url, {}, {
            getAppData: {
                method: "GET",
                params: {},
                isArray: true,
                cache: true
            }
        });
    });

angular
    .module('resources')
    .factory('sendToView', function ($http) {
        var sendToView = function (url_suffix, data) {
            console.log(data);
            var url = url_suffix;
            return $http.post(url, data)
                .success(function (data) {
                    return data
                })
                .error(function (data, status) {
                    return status
                });
        };
        return {
            sendToView: sendToView
        }

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
                    return data
                })
                .error(function (data, status) {
                    return status
                });
        };
        return {
            uploadFile: uploadFile
        }

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
                }
            });
        };

        return {
            getCurrentOrg: getCurrentOrg
        }


    });
angular
    .module('resources')
    .factory('speciesGenes', function ($http) {
        console.log('speciesGenes');
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
                    return response
                })
                .error(function (response) {
                    return response
                })
        };
        return {
            getSpeciesGenes: getSpeciesGenes
        }
    });


//genes for current organism

angular
    .module('resources')
    .factory('allOrgGenes', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getAllOrgGenes = function (taxid) {
            var url = endpoint + encodeURIComponent("SELECT ?gene ?geneLabel ?proteinLabel ?protein ?entrez ?refseqProt " +
                    "?locusTag ?uniprot ?chromosome ?chromosomeLabel ?refSeqChromosome ?refSeqChromosomeLabel ?genStart ?genEnd ?strand " +
                    "(group_concat(?aliases;separator=', ') as ?alias) " +
                    "WHERE{ ?taxon wdt:P685 '" + taxid + "'. " +
                    "?gene wdt:P703 ?taxon; " +
                    "wdt:P279 wd:Q7187; " +
                    "wdt:P2393 ?locusTag; " +
                    "wdt:P351 ?entrez; " +
                    "wdt:P644 ?genStart; " +
                    "wdt:P645 ?genEnd; " +
                    "wdt:P2548 ?strand; " +
                    "skos:altLabel ?aliases. " +
                    "OPTIONAL {?gene wdt:P688 ?protein; wdt:P352 ?uniprot; wdt:P637 ?refseqProt. }" +
                    "?gene p:P644 ?chr. ?chr pq:P1057 ?chromosome. " +
                    "?chromosome wdt:P2249 ?refSeqChromosome." +
                    "SERVICE wikibase:label { " +
                    "bd:serviceParam wikibase:language 'en' ." +
                    "}" +
                    "} " +
                    "GROUP BY ?gene ?geneLabel ?protein ?proteinLabel ?entrez ?refseqProt " +
                    "?locusTag ?uniprot ?chromosome ?chromosomeLabel ?genStart ?genEnd ?strand " +
                    "?refSeqChromosome ?refSeqChromosomeLabel "
                );
            console.log(url);
            return $http.get(url)
                .success(function (response) {
                    return response
                })
                .error(function (response) {
                    return response
                })
        };
        return {
            getAllOrgGenes: getAllOrgGenes
        }
    });

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
                    return response
                })
                .error(function (response) {
                    return response
                })
        };
        return {
            getAllOrgOperons: getAllOrgOperons
        }
    });


//annotations data
angular
    .module('resources')
    .factory('GOTerms', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getGoTerms = function (uniprot) {
            var url = endpoint + encodeURIComponent(
                    "SELECT  distinct ?gotermValueLabel ?goID ?gotermValue ?goclass ?determinationLabel ?reference_stated_inLabel ?reference_retrievedLabel ?ecnumber WHERE { ?protein wdt:P352 " +
                    "'" + uniprot + "'. " +
                    "{?protein p:P680 ?goterm} UNION {?protein p:P681 ?goterm} UNION {?protein p:P682 ?goterm}.  " +
                    "?goterm pq:P459 ?determination .  ?goterm prov:wasDerivedFrom/pr:P248 ?reference_stated_in . " +
                    "?goterm prov:wasDerivedFrom/pr:P813 ?reference_retrieved . " +
                    "OPTIONAL {?goterm prov:wasDerivedFrom/pr:P698 ?pmid .}" +
                    "{?goterm ps:P680 ?gotermValue} UNION {?goterm ps:P681 ?gotermValue} UNION {?goterm ps:P682 ?gotermValue}.  " +
                    "?gotermValue wdt:P279* ?goclass; wdt:P686 ?goID. FILTER ( ?goclass = wd:Q2996394 || ?goclass = wd:Q5058355 || ?goclass = wd:Q14860489) " +
                    "OPTIONAL {?gotermValue wdt:P591 ?ecnumber.}" +
                    "SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\" .}}"
                );
            return $http.get(url)
                .success(function (response) {
                    return response.data

                })
                .error(function (response) {
                    return response
                });

            //    .then(function (response) {
            //
            //    return response.data.results.bindings;
            //
            //});
        };
        return {
            getGoTerms: getGoTerms
        }


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
        }


    });

angular
    .module('resources')
    .factory('RefSeqChrom', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getRefSeqChrom = function (locusTag) {
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
        return {
            getRefSeqChrom: getRefSeqChrom
        }


    });

angular
    .module('resources')
    .factory('hostPathogen', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getHostPathogen = function (uniprot) {
            var url = endpoint + encodeURIComponent(
                    "SELECT ?host ?hostLabel ?protein ?proteinLabel ?hostProtein ?hostGeneLabel ?hostProteinLabel ?reference_stated_in ?reference_stated_inLabel ?pmid " +
                    "(group_concat(distinct ?determination ;separator=\", \") as ?dmethod) " +
                    "(group_concat(distinct ?det_label ;separator=\", \") as ?dmethodLabel) " +
                    "WHERE{ " +
                    "?protein wdt:P352 '" + uniprot + "'; " +
                    "wdt:P129 ?hostProtein; " +
                    "p:P129 ?hpClaim. " +
                    "?hpClaim prov:wasDerivedFrom/pr:P248 ?reference_stated_in; " +
                    "pq:P459 ?determination. " +
                    "?determination rdfs:label ?det_label. " +
                    "?reference_stated_in wdt:P698 ?pmid. " +
                    "?hostProtein wdt:P703 ?host; " +
                    "wdt:P702 ?hostGene. " +
                    "FILTER (lang(?det_label) = \"en\") " +
                    "SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\" .}" +
                    "} " +
                    "GROUP BY ?protein ?hostGeneLabel ?proteinLabel ?reference_stated_in ?reference_stated_inLabel ?pmid ?hostProtein ?hostProteinLabel ?host ?hostLabel"
                );

            console.log(url);
            return $http.get(url).then(function (response) {
                return response.data.results.bindings;
            });
        };
        return {
            getHostPathogen: getHostPathogen
        }


    });

angular
    .module('resources')
    .factory('OperonData', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getOperonData = function (entrez) {
            var url = endpoint + encodeURIComponent(
                    "SELECT ?gene ?locusTag ?entrez ?operon ?operonLabel ?operonItem  ?operonItemLabel ?genStart ?genEnd ?strand " +
                    "?strandLabel ?op_genes ?reference_stated_in ?reference_stated_inLabel ?op_genesLabel " +
                    "?reference_pmid " +
                    "WHERE { " +
                    "?gene wdt:P351 '" + entrez + "'; " +
                    "p:P361 ?operon. " +
                    "?operon ps:P361 ?operonItem. " +
                    "?operonItem wdt:P279 wd:Q139677; " +
                    "wdt:P527 ?op_genes. " +
                    "?op_genes wdt:P2393 ?locusTag; " +
                    "wdt:P351 ?entrez; " +
                    "wdt:P644 ?genStart; " +
                    "wdt:P645 ?genEnd; " +
                    "wdt:P2548 ?strand." +
                    "OPTIONAL { " +
                    "?operon prov:wasDerivedFrom/pr:P248 ?reference_stated_in. " +
                    "?reference_stated_in wdt:P698 ?reference_pmid. } " +
                    "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en' . }}"
                );
            return $http.get(url)
                .success(function (response) {
                    return response.data

                })
                .error(function (response) {
                    return response
                });
        };
        return {
            getOperonData: getOperonData
        }
    });

angular
    .module('resources')
    .factory('expasyData', function ($http) {
        var expasy_endpoint = 'http://enzyme.expasy.org/EC/{ecnumber}.txt';

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
                            reactionData['ecnumber'] = value.slice(5);
                        }
                        if (value.match("^CA ")) {
                            var trimmedReaction = value.replace(/^(CA)/, "");
                            reactionData['reaction'].push(trimmedReaction);
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
        }


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
                    return response
                });
        };
        return {
            getPMID: getPMID
        }
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
                    return response
                });
        };
        return {
            getlocusTag2Pub: getlocusTag2Pub
        }
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
                    return response
                });
        };
        return {
            getEuroPubData: getEuroPubData
        }
    });

angular
    .module('resources')
    .factory('pubLinks', function ($http, $filter) {
        var getPubLinks = function (entrez) {
            var endpoint = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=gene&db=pubmed&id={entrez}&retmode=json&linkname=gene_pubmed_pmc_nucleotide';

            var url = endpoint.replace('{entrez}', entrez);
            return $http.get(url)
                .success(function (response) {
                    return response
                })
                .error(function (response) {
                    return response
                });
        };
        return {
            getPubLinks: getPubLinks
        }
    });

angular
    .module('resources')
    .factory('recentChlamPubLinks', function ($http) {
        var getRecentChlamPubLinks = function (entrez) {
            var url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=chlamydia trachomatis&reldate=10&datetype=edat&retmax=100&usehistory=y&retmode=json';
            return $http.get(url)
                .success(function (response) {
                    return response
                })
                .error(function (response) {
                    return response
                });
        };
        return {
            getRecentChlamPubLinks: getRecentChlamPubLinks
        }
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
                    return response
                });
        };
        return {
            getGoTermsAll: getGoTermsAll
        }

    });

angular
    .module('resources')
    .factory('allChlamydiaGenes', function ($http) {
        var getAllChlamGenes = function () {
            var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
            var url = endpoint + encodeURIComponent(
                    "SELECT ?taxon ?taxid ?taxonLabel ?gene ?geneLabel ?entrez  ?uniprot ?protein ?proteinLabel ?locusTag " +
                    "?geneDescription ?refseq_prot ?aliases " +
                    "WHERE {  " +
                    "?taxon wdt:P171* wd:Q846309.  " +
                    "?gene wdt:P279 wd:Q7187;  " +
                    "wdt:P703 ?taxon;  " +
                    "wdt:P351 ?entrez;  " +
                    "wdt:P2393 ?locusTag;  " +
                    "wdt:P688 ?protein;  " +
                    "skos:altLabel ?aliases." +
                    "?protein wdt:P352 ?uniprot;  " +
                    "wdt:P637 ?refseq_prot. " +
                    "?taxon wdt:P685 ?taxid." +
                    "SERVICE wikibase:label {bd:serviceParam wikibase:language 'en'.}}");
            return $http.get(url)
                .success(function (response) {
                    return response.data;
                })
                .error(function (response) {
                    return response
                });
        };
        return {
            getAllChlamGenes: getAllChlamGenes
        }
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
                    return response
                },
                error: function (response) {
                    return response
                }
            });
        };
        return {
            wdGetEntities: wdGetEntities

        }
    });


angular
    .module('resources')
    .factory('entrez2QID', function ($http, $filter) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getEntrez2QID = function (entrez) {
            var query = "SELECT distinct ?gene ?protein WHERE{" +
                "?gene wdt:P351 '{entrez}'; " +
                "wdt:P688 ?protein.}";
            var url = endpoint + encodeURIComponent(query.replace('{entrez}', entrez));
            return $http.get(url)
                .success(function (response) {
                    return response;
                })
                .error(function (response) {
                    return response
                });

        };
        return {
            getEntrez2QID: getEntrez2QID
        }


    });

angular
    .module('resources')
    .factory('locusTag2QID', function ($http, $filter) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getLocusTag2QID = function (locusTag, taxid) {
            var query = "SELECT distinct ?gene ?protein WHERE{" +
                "?strain wdt:P685 '{taxid}'. " +
                "?gene wdt:P2393 '{locusTag}'; " +
                "wdt:P703 ?strain; " +
                "wdt:P688 ?protein.}";
            var url1 = query.replace('{taxid}', taxid);
            var url = endpoint + encodeURIComponent(url1.replace('{locusTag}', locusTag));
            return $http.get(url)
                .success(function (response) {
                    return response;

                })
                .error(function (response) {

                    return response
                });

        };
        return {
            getLocusTag2QID: getLocusTag2QID
        }


    });


angular
    .module('resources')
    .factory('abstractSPARQL', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getAbstractSPARQL = function (pqid, pred, idprop) {
            var preq = "PREFIX wd: <http://www.wikidata.org/entity/> " +
                "PREFIX prov: <http://www.w3.org/ns/prov#> " +
                "PREFIX pr: <http://www.wikidata.org/prop/reference/> " +
                "PREFIX p: <http://www.wikidata.org/prop/> " +
                "PREFIX ps: <http://www.wikidata.org/prop/statement/> " +
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

                    return response
                });
        };
        return {
            getAbstractSPARQL: getAbstractSPARQL
        }


    });