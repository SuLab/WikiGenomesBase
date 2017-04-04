angular
    .module('geneForm')
    .component('geneForm', {
        templateUrl: '/static/wiki/js/angular_templates/gene-form.html',
        bindings: {
            taxid: '<'
        },
        controller: function ($location, allOrgGenes) {
            var ctrl = this;
            ctrl.$onChanges = function (changesObj) {
                if (changesObj.taxid) {
                    allOrgGenes.getAllOrgGenes(ctrl.taxid)
                        .then(function (data) {
                            ctrl.currentAllGenes = data.data.results.bindings;
                        });
                }
            };
            ctrl.onSelect = function ($item) {
                $location.path('/organism/' + ctrl.taxid + "/gene/" + $item.locusTag.value);
            };
        }
    });
