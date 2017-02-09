angular
    .module('mainPage')
    .component('mainPage', {
        controller: function ($filter, $location, allOrgs, allOrgGenes, currentGene, currentOrg, currentOrgFetch) {
            var ctrl = this;

            ctrl.$onInit = function () {
                allOrgs.getAllOrgs(function (data) {
                    ctrl.orgList = data;
                });
                ctrl.currentTaxid = $location.path().split("/")[2];
                ctrl.currentEntrez = $location.path().split("/")[4];
                ctrl.currentGene = {};
                allOrgGenes.getAllOrgGenes(ctrl.currentTaxid)
                    .then(function (data) {
                        ctrl.currentAllGenes = data.data.results.bindings;
                        var curgene = $filter('getJsonItem')('entrez', ctrl.currentEntrez, ctrl.currentAllGenes);

                        if (curgene == undefined) {
                            alert("not a valid gene id");
                            $location.path('/organism/' + ctrl.currentTaxid);
                        }
                        ctrl.currentGene.geneLabel = curgene.geneLabel.value;
                        ctrl.currentGene.entrez = curgene.entrez.value;
                        ctrl.currentGene.gene = curgene.gene.value;
                        ctrl.currentGene.protein = curgene.protein.value;
                        ctrl.currentGene.proteinLabel = curgene.proteinLabel.value;
                        ctrl.currentGene.uniprot = curgene.uniprot.value;
                        ctrl.currentGene.refseqProt = curgene.refseqProt.value;
                        ctrl.currentGene.locusTag = curgene.locusTag.value;
                        ctrl.currentGene.genStart = curgene.genStart.value;
                        ctrl.currentGene.genEnd = curgene.genEnd.value;
                        ctrl.currentGene.strand = curgene.strand.value;
                        ctrl.currentGene.refseqGenome = curgene.refSeqChromosome.value;

                    });
                ctrl.currentOrg = currentOrg;


                currentOrgFetch.getCurrentOrg(ctrl.currentTaxid).then(function (data) {
                    currentOrg.taxon = data.taxon;
                    currentOrg.taxid = data.taxid;
                    currentOrg.taxonLabel = data.taxonLabel;
                });
            };


        },
        templateUrl: '/static/wiki/js/angular_templates/main-page_new.html'
    });