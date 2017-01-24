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
    .value('currentOrg', {
        taxon: '',
        taxid: '',
        taxonLabel: ''
    });


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
    .factory('allOrgGenes', function ($http) {
        var allGenes = [];
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getAllOrgGenes = function (taxid) {
            var url = endpoint + encodeURIComponent("SELECT ?refSeqChromosome ?gene ?genStart ?genEnd ?strand ?geneLabel ?entrez ?locusTag ?protein " +
                    "?proteinLabel ?uniprot ?refseqProt" +
                    " WHERE{ ?taxon wdt:P685 '" + taxid + "'. " +
                    "?gene wdt:P703 ?taxon; " +
                    "wdt:P279 wd:Q7187; " +
                    "wdt:P644 ?genStart; " +
                    "wdt:P645 ?genEnd; " +
                    "wdt:P2548 ?strand; " +
                    "wdt:P2393 ?locusTag; " +
                    "wdt:P351 ?entrez; " +
                    "wdt:P688 ?protein. " +
                    "?protein wdt:P352 ?uniprot; " +
                    "wdt:P637 ?refseqProt." +

                    "OPTIONAL{ ?gene p:P644 ?chr. ?chr pq:P2249 ?refSeqChromosome.} " +
                    "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en' . } }");
            return $http.get(url).then(function (response) {
                allGenes = response.data.results.bindings;
                console.log(allGenes);
                return allGenes
            });
        };
        return {
            getAllOrgGenes: getAllOrgGenes
        }
    });


//angular
//    .module('resources')
//    .factory('allOrgGenes', function ($http) {
//        var allGenes = [];
//        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
//        var getAllOrgGenes = function (taxid) {
//            var url = endpoint + encodeURIComponent("SELECT ?gene ?geneLabel ?entrez ?locusTag ?protein " +
//                    "?proteinLabel ?uniprot ?refseqProt" +
//                    " WHERE{ ?taxon wdt:P685 '" + taxid + "'. " +
//                    "?gene wdt:P703 ?taxon; " +
//                    "wdt:P279 wd:Q7187; " +
//                    "wdt:P2393 ?locusTag; " +
//                    "wdt:P351 ?entrez; " +
//                    "wdt:P688 ?protein. " +
//                    "?protein wdt:P352 ?uniprot; " +
//                    "wdt:P637 ?refseqProt." +
//                    "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en' . } }");
//            return $http.get(url).then(function (response) {
//                allGenes = response.data.results.bindings;
//                return allGenes
//            });
//        };
//        return {
//            getAllOrgGenes: getAllOrgGenes
//        }
//    });


angular
    .module('resources')
    .value('currentAllGenes', {
        allGenes: ''
    });


angular
    .module('resources')
    .value('currentGene', {
        geneLabel: '',
        entrez: '',
        gene: '',
        protein: '',
        proteinLabel: '',
        uniprot: '',
        refseqProt: '',
        locusTag: '',
        genStart: '',
        genEnd: '',
        strand: '',
        refseqGenome: ''
    });


angular
    .module('resources')
    .factory('GOTerms', function ($http) {
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getGoTerms = function (uniprot) {
            var url = endpoint + encodeURIComponent(
                    "SELECT ?protein ?proteinLabel ?goterm  ?reference_stated_inLabel ?reference_retrievedLabel ?determination  " +
                    "?determinationLabel ?gotermValue ?gotermValueLabel ?goclass ?goclassLabel ?goID ?ecnumber ?pmid WHERE { ?protein wdt:P352 " +
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
            return $http.get(url).then(function (response) {
                return response.data.results.bindings;

            });
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
            return $http.get(url).then(function (response) {
                console.log(response.data.results.bindings);
                return response.data.results.bindings;


            });
        };
        return {
            getOperonData: getOperonData
        }


    });






