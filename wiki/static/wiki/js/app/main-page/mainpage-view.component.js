//angular
//    .module('mainPage')
//    .component('mainPage', {
//        controller: function (currentOrg, currentGene, allOrgs, currentAllGenes, allOrgGenes) {
//
//            var ctrl = this;
//            ctrl.currentOrg = currentOrg;
//            ctrl.currentGene = currentGene;
//            currentAllGenes.allGenes = allOrgGenes.getAllOrgGenes(ctrl.currentOrg);
//            currentAllGenes.allGenes.then(function (data) {
//                ctrl.currentAllGenes = data;
//            });
//
//            allOrgs.getAllOrgs(function (data) {
//                ctrl.orgList = data;
//            });
//        },
//        templateUrl: '/static/wiki/js/angular_templates/main-page.html'
//    });
angular
    .module('mainPage')
    .component('mainPage', {
        controller: function ($location, allOrgs, allOrgGenes, currentGene, currentOrg, currentOrgFetch) {
            var ctrl = this;


            ctrl.$onInit = function () {
                ctrl.currentTaxid = $location.path().split("/").pop();
                allOrgs.getAllOrgs(function (data) {
                    ctrl.orgList = data;
                });
                currentOrgFetch.getCurrentOrg(ctrl.currentTaxid).then(function(data) {
                    currentOrg.taxon = data.taxon;
                    currentOrg.taxid = data.taxid;
                    currentOrg.taxonLabel = data.taxonLabel;
                });
                allOrgGenes.getAllOrgGenes(ctrl.currentTaxid).then(function(data){
                    ctrl.currentAllGenes = data;
                    currentGene.geneLabel = data[0].geneLabel.value;
                    currentGene.entrez = data[0].entrez.value;
                    currentGene.gene = data[0].gene.value;
                    currentGene.protein = data[0].protein.value;
                    currentGene.proteinLabel = data[0].proteinLabel.value;
                    currentGene.uniprot = data[0].uniprot.value;
                    currentGene.refseqProt = data[0].refseqProt.value;
                    currentGene.locusTag = data[0].locusTag.value;
                    currentGene.genStart = data[0].genStart.value;
                    currentGene.genEnd = data[0].genEnd.value;
                    currentGene.strand = data[0].strand.value;
                    currentGene.refseqGenome = data[0].refSeqChromosome.value;

                });
                ctrl.currentOrg = currentOrg;
                ctrl.currentGene = currentGene;
            };




        },
        templateUrl: '/static/wiki/js/angular_templates/main-page.html'
    });
