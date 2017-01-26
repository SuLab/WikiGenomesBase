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
                    "SELECT  distinct ?gotermValueLabel ?goID ?gotermValue ?goclass ?determinationLabel ?reference_stated_inLabel ?reference_retrievedLabel WHERE { ?protein wdt:P352 " +
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
                return response.data.results.bindings;

            });
        };
        return {
            getOperonData: getOperonData
        }


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


//
//angular
//    .module('resources')
//    .factory('evidenceCodes', function () {
//        return [
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23174389",
//                "evidence_codeLabel": "IPI",
//                "name": "Inferred from Physical Interaction",
//                "eviURL": "http://geneontology.org/page/ipi-inferred-physical-interaction/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190825",
//                "evidence_codeLabel": "ISM",
//                "name": "Inferred from Sequence Model",
//                "eviURL": "http://geneontology.org/page/ism-inferred-sequence-model/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23175558",
//                "evidence_codeLabel": "ISS",
//                "name": "Inferred from Sequence or structural Similarity",
//                "eviURL": "http://geneontology.org/page/iss-inferred-sequence-or-structural-similarity/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190881",
//                "evidence_codeLabel": "IEA",
//                "name": "Inferred from Electronic Annotation",
//                "eviURL": "http://geneontology.org/page/automatically-assigned-evidence-codes/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190827",
//                "evidence_codeLabel": "IBA",
//                "name": "Inferred from Biological aspect of Ancestor",
//                "eviURL": "http://geneontology.org/page/iba-inferred-biological-aspect-ancestor/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190833",
//                "evidence_codeLabel": "IBD",
//                "name": "Inferred from Biological aspect of Descendant",
//                "eviURL": "http://geneontology.org/page/ibd-inferred-biological-aspect-descendent/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190852",
//                "evidence_codeLabel": "RCA",
//                "name": "Inferred from Reviewed Computational Analysis",
//                "eviURL": "http://geneontology.org/page/rca-inferred-reviewed-computational-analysis/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190738",
//                "evidence_codeLabel": "ISA",
//                "name": "Inferred from Sequence Alignment",
//                "eviURL": "http://geneontology.org/page/isa-inferred-sequence-alignment/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190856",
//                "evidence_codeLabel": "IC",
//                "name": "Inferred by Curator",
//                "eviURL": "http://geneontology.org/page/ic-inferred-curator/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190854",
//                "evidence_codeLabel": "NAS",
//                "name": "Non-traceable Author Statement",
//                "eviURL": "http://geneontology.org/page/nas-non-traceable-author-statement/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190826",
//                "evidence_codeLabel": "IGC",
//                "name": "Inferred from Genomic Context",
//                "eviURL": "http://geneontology.org/page/igc-inferred-genomic-context/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190850",
//                "evidence_codeLabel": "IRD",
//                "name": "Inferred from Rapid Divergence",
//                "eviURL": "http://geneontology.org/page/ird-inferred-rapid-divergence/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23173789",
//                "evidence_codeLabel": "EXP",
//                "name": "Inferred from Experiment",
//                "eviURL": "http://geneontology.org/page/exp-inferred-experiment/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190853",
//                "evidence_codeLabel": "TAS",
//                "name": "Traceable Author Statement",
//                "eviURL": "http://geneontology.org/page/tas-traceable-author-statement/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23175251",
//                "evidence_codeLabel": "IEP",
//                "name": "Inferred from Expression Pattern",
//                "eviURL": "http://geneontology.org/page/iep-inferred-expression-pattern/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23174122",
//                "evidence_codeLabel": "IDA",
//                "name": "Inferred from Direct Assay",
//                "eviURL": "http://geneontology.org/page/ida-inferred-direct-assay/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190857",
//                "evidence_codeLabel": "ND",
//                "name": "No biological Data available",
//                "eviURL": "http://geneontology.org/page/nd-no-biological-data-available/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190637",
//                "evidence_codeLabel": "ISO",
//                "name": "Inferred from Sequence Orthology",
//                "eviURL": "http://geneontology.org/page/iso-inferred-sequence-orthology/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23174952",
//                "evidence_codeLabel": "IGI",
//                "name": "Inferred from Genetic Interaction",
//                "eviURL": "http://geneontology.org/page/igi-inferred-genetic-interaction/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23174671",
//                "evidence_codeLabel": "IMP",
//                "name": "Inferred from Mutant Phenotype",
//                "eviURL": "http://geneontology.org/page/imp-inferred-mutant-phenotype/"
//            },
//            {
//                "evidence_code": "http://www.wikidata.org/entity/Q23190842",
//                "evidence_codeLabel": "IKR",
//                "name": "Inferred from Key Residues",
//                "eviURL": "http://geneontology.org/page/ikr-inferred-key-residues/"
//            }
//        ];
//    });