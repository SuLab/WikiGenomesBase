angular
    .module('allgenesDownload')
    .component('allgenesDownload', {
        template: '<a target="_blank" href="{{$ctrl.genesUrl()}}"><div class="btn btn-default">Download Genes</div></a>',

        bindings: {
            taxid: '<'
        },
        controller: function () {

            var ctrl = this;


            ctrl.$onChanges = function (changesObj) {
                if (changesObj.taxid) {
                    ctrl.genesUrl = function () {
                        return "https://query.wikidata.org/#SELECT ?refSeqChromosome " +
                            "?gene ?genStart ?genEnd ?strand ?geneLabel ?entrez ?locusTag ?protein " +
                            "?proteinLabel ?uniprot ?refseqProt" +
                            " WHERE{ ?taxon wdt:P685 '" + ctrl.taxid + "'. " +
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
                            "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en' . } }";
                    }

                }

            };
        }

    });