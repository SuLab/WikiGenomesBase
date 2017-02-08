angular
    .module('mainPage')
    .component('mainPage', {
        controller: function ($location, allOrgs, allOrgGenes, currentGene, currentOrg, currentOrgFetch) {
            var ctrl = this;

            ctrl.$onInit = function () {
                allOrgs.getAllOrgs(function (data) {
                    ctrl.orgList = data;
                });
                ctrl.currentTaxid = $location.path().split("/")[2];
                console.log(ctrl.currentTaxid);
                allOrgGenes.getAllOrgGenes(ctrl.currentTaxid)
                    .then(function (data) {
                        ctrl.currentAllGenes = data.data.results.bindings;

                        currentGene.geneLabel = ctrl.currentAllGenes[0].geneLabel.value;
                        currentGene.entrez = ctrl.currentAllGenes[0].entrez.value;
                        currentGene.gene = ctrl.currentAllGenes[0].gene.value;
                        currentGene.protein = ctrl.currentAllGenes[0].protein.value;
                        currentGene.proteinLabel = ctrl.currentAllGenes[0].proteinLabel.value;
                        currentGene.uniprot = ctrl.currentAllGenes[0].uniprot.value;
                        currentGene.refseqProt = ctrl.currentAllGenes[0].refseqProt.value;
                        currentGene.locusTag = ctrl.currentAllGenes[0].locusTag.value;
                        currentGene.genStart = ctrl.currentAllGenes[0].genStart.value;
                        currentGene.genEnd = ctrl.currentAllGenes[0].genEnd.value;
                        currentGene.strand = ctrl.currentAllGenes[0].strand.value;
                        currentGene.refseqGenome = ctrl.currentAllGenes[0].refSeqChromosome.value;

                    });
                ctrl.currentOrg = currentOrg;
                ctrl.currentGene = currentGene;

                currentOrgFetch.getCurrentOrg(ctrl.currentTaxid).then(function (data) {
                    currentOrg.taxon = data.taxon;
                    currentOrg.taxid = data.taxid;
                    currentOrg.taxonLabel = data.taxonLabel;
                });
            };


        },
        templateUrl: '/static/wiki/js/angular_templates/main-page2.html'
    });
