angular
    .module('operonForm')
    .component('operonForm', {
        controller: function ($location, pubMedData, allOrgGenes) {
            var ctrl = this;
            ctrl.$onInit = function () {
            };
            ctrl.$onChanges = function (changesObj) {
                if (changesObj.taxid) {
                    allOrgGenes.getAllOrgGenes(ctrl.taxid)
                        .then(function (data) {
                            ctrl.currentAllGenes = data.data.results.bindings;
                        });

                }
            };

            ctrl.operonFormModel = {
                genes: [],
                pub: []
            };
            ctrl.getOperon = function (val) {


            };
            ctrl.getPMID = function (val) {
                return pubMedData.getPMID(val).then(
                    function (data) {
                        var resultData = [data.data.result[val]];
                        return resultData.map(function (item) {
                            return item;
                        });
                    }
                );
            };
            ctrl.onSelectGene = function ($item) {
                ctrl.operonFormModel.genes.push($item.gene.value);
                console.log(ctrl.operonFormModel);
            };
            ctrl.onSelectPub = function ($item) {
                ctrl.operonFormModel.pub.push($item);
                console.log($item);
            };


        },
        templateUrl: '/static/wiki/js/angular_templates/operon-form.html',
        bindings: {
            data: '<',
            taxid: '<'
        }
    });
