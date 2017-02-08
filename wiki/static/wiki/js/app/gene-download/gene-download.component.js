angular
    .module('geneDownload')
    .component('geneDownload', {
        templateUrl: '/static/wiki/js/angular_templates/gene-download.html',

        bindings: {
            taxid: '<'
        },
        controller: function (allOrgGenes) {

            var ctrl = this;
            console.log("gene download");
            ctrl.$onChanges = function (changesObj) {


                if (changesObj.taxid) {
                    ctrl.exportJson = function () {
                        allOrgGenes.getAllOrgGenes(ctrl.taxid).then(function (data) {
                            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

                            var dlAnchorElem = document.getElementById('downloadAnchorElem');
                            dlAnchorElem.setAttribute("href", dataStr);
                            dlAnchorElem.setAttribute("download", ctrl.taxid + "genes.json");
                        });
                    }
                }
            };

        }
    });