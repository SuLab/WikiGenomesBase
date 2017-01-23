angular
    .module('organismForm')
    .component('organismForm', {
        controller: function ($location, currentOrg, currentGene, allOrgGenes, currentAllGenes) {
            var ctrl = this;
            ctrl.onSelect = function ($item) {
                $location.path('/organism/' + $item.taxid);
                console.log($item);
                currentOrg.taxon = $item.taxon;
                currentOrg.taxonLabel = $item.taxonLabel;
                currentOrg.taxid = $item.taxid;
                currentAllGenes.allGenes = allOrgGenes.getAllOrgGenes(currentOrg.taxid);
                currentAllGenes.allGenes.then(function (data) {
                    currentGene.geneLabel = data[0].geneLabel.value;
                    currentGene.entrez = data[0].entrez.value;
                    currentGene.gene = data[0].gene.value;
                    currentGene.protein = data[0].protein.value;
                    currentGene.proteinLabel = data[0].proteinLabel.value;
                    currentGene.uniprot = data[0].uniprot.value;
                    currentGene.refseqProt = data[0].refseqProt.value;
                    currentGene.locusTag = data[0].locusTag.value;
                });

            };
        },
        templateUrl: '/static/wiki/js/angular_templates/organism-form.html',
        bindings: {
            orgs: '<'
        }
    });


