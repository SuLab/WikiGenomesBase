angular
    .module('geneForm')
    .component('geneForm', {
        templateUrl: '/static/wiki/js/angular_templates/gene-form.html',
        bindings: {
            taxid: '<'
        },
        controller: function (allOrgGenes, currentGene) {
            var ctrl = this;
            ctrl.$onChanges = function (changesObj) {
                if (changesObj.taxid) {
                    allOrgGenes.getAllOrgGenes(ctrl.taxid).then(function (data) {
                        ctrl.currentAllGenes = data;
                    });
                }
            };
            ctrl.onSelect = function ($item) {
                currentGene.geneLabel = $item.geneLabel.value;
                currentGene.entrez = $item.entrez.value;
                currentGene.gene = $item.gene.value;
                currentGene.protein = $item.protein.value;
                currentGene.proteinLabel = $item.proteinLabel.value;
                currentGene.uniprot = $item.uniprot.value;
                currentGene.refseqProt = $item.refseqProt.value;
                currentGene.locusTag = $item.locusTag.value;
            };
        }
    });