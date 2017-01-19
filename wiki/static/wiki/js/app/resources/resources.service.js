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
    .factory('allOrgGenes', function ($http) {
        var allGenes = [];
        var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
        var getAllOrgGenes = function (taxid) {
            var url = endpoint + encodeURIComponent("SELECT ?gene ?geneLabel ?entrez ?locusTag ?protein " +
                    "?proteinLabel ?uniprot ?refseqProt" +
                    " WHERE{ ?taxon wdt:P685 '" + taxid + "'. " +
                    "?gene wdt:P703 ?taxon; " +
                    "wdt:P279 wd:Q7187; " +
                    "wdt:P2393 ?locusTag; " +
                    "wdt:P351 ?entrez; " +
                    "wdt:P688 ?protein. " +
                    "?protein wdt:P352 ?uniprot; " +
                    "wdt:P637 ?refseqProt." +
                    "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en' . } }");
            return $http.get(url).then(function (response) {
                allGenes = response.data.results.bindings;
                return allGenes
            });
        };
        return {
            getAllOrgGenes: getAllOrgGenes
        }


    });


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
        locusTag: ''
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