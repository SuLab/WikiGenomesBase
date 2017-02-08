angular
    .module('browserPage')
    .component('browserPage', {
        controller: function ($filter, $location, allOrgs,
                              allOrgGenes, currentGene, currentOrg,
                              currentOrgFetch) {
            var ctrl = this;

            ctrl.$onInit = function () {
                allOrgs.getAllOrgs(function (data) {
                    ctrl.orgList = data;
                });
                ctrl.currentTaxid = $location.path().split("/")[2];
                allOrgGenes.getAllOrgGenes(ctrl.currentTaxid)
                    .then(function (data) {
                        ctrl.currentAllGenes = data.data.results.bindings;
                    });
                ctrl.currentOrg = currentOrg;
                ctrl.currentGene = currentGene;

                currentOrgFetch.getCurrentOrg(ctrl.currentTaxid).then(function (data) {
                    currentOrg.taxon = data.taxon;
                    currentOrg.taxid = data.taxid;
                    currentOrg.taxonLabel = data.taxonLabel;
                });

                ctrl.onSelect = function ($item) {
                    console.log($item);
                    $location.path('/organism/' + ctrl.currentTaxid + "/gene/" + $item.entrez.value);
                    currentGene.geneLabel = $item.geneLabel.value;
                    currentGene.entrez = $item.entrez.value;
                    currentGene.gene = $item.gene.value;
                    currentGene.protein = $item.protein.value;
                    currentGene.proteinLabel = $item.proteinLabel.value;
                    currentGene.uniprot = $item.uniprot.value;
                    currentGene.refseqProt = $item.refseqProt.value;
                    currentGene.locusTag = $item.locusTag.value;
                    currentGene.genStart = $item.genStart.value;
                    currentGene.genEnd = $item.genEnd.value;
                    currentGene.strand = $item.strand.value;
                    currentGene.refseqGenome = $item.refSeqChromosome.value;

                };


            };


        },
        templateUrl: '/static/wiki/js/angular_templates/browser-page.html'
    });

var app = angular.module('myApp', []);

// alternate - https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination
// alternate - http://fdietz.github.io/recipes-with-angular-js/common-user-interface-patterns/paginating-through-client-side-data.html
