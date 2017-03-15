angular
    .module('jbrowseView')
    .component('jbrowseView', {
        template: '<iframe class="jbrowse" ng-src={{$ctrl.jbrowseURI()}}></iframe>',
        bindings: {
            taxid: '<',
            gene: '<',
            entrez: '<'
        },
        controller: function ($location) {

            var ctrl = this;

            ctrl.$onInit = function () {
                //ctrl.jbrowseURI = function () {
                //    var start = Number(ctrl.gene.genStart) - 1000;
                //    var end = Number(ctrl.gene.genEnd) + 1000;
                //    console.log(start, end);
                //    return "static/wiki/js/JBrowse-1.12.1/index.html?data=sparql_data/sparql_data_"
                //        + $location.path().split("/")[2] +
                //        "&tracks=genes_canvas_mod,operons_canvas_mod,variants_canvas_mod&menu=0&loc=" + ctrl.gene.refseqGenome + ":" + start + '..' + end;
                //};

            };
            ctrl.$onChanges = function (changesObj) {
                if (changesObj.entrez) {
                    ctrl.jbrowseURI = function () {
                        var start = Number(ctrl.gene.genStart) - 1000;
                        var end = Number(ctrl.gene.genEnd) + 1000;
                        return "static/wiki/js/JBrowse-1.12.1/index.html?data=sparql_data/sparql_data_"
                            + $location.path().split("/")[2] +
                            "&tracks=genes_canvas_mod,operons_canvas_mod,variants_canvas_mod&menu=0&loc=" + ctrl.gene.refseqGenome + ":" + start + '..' + end;
                    };

                }

            };
            //ctrl.$onChanges = function (changesObj){
            //    if (changesObj.entrez) {
            //        if(ctrl.entrez == undefined){
            //            ctrl.jbrowseURI = function () {
            //            return "static/wiki/js/JBrowse-1.12.1/index.html?data=sparql_data/sparql_data_"
            //                + $location.path().split("/")[2] +
            //                "&tracks=genes_canvas_mod,operons_canvas_mod&menu=0";
            //        };
            //
            //        }else{
            //
            //        }
            //    }
            //};
        }
    });



