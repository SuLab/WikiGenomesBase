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

//angular
//    .module('resources')
//    .value('currentOrg', {
//        taxon: 'http://www.wikidata.org/entity/Q21065231',
//        taxid: 85962,
//        taxonLabel: 'Helicobacter pylori 26695'
//    });
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
        var getAllOrgGenes = function(taxid) {
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
            return $http.get(url).then(function(response){
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


//angular
//    .module('resources')
//    .value('currentGene', {
//        geneLabel: 'preprotein translocase subunit SecD HP1550',
//        entrez: '899741',
//        gene: 'https://www.wikidata.org/wiki/Q21628676',
//        protein: 'https://www.wikidata.org/wiki/Q21632122',
//        proteinLabel: 'https://www.wikidata.org/wiki/Q21632122',
//        uniprot: 'O26074',
//        refseqProt: 'NP_208341',
//        locusTag: 'HP1550'
//    });

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