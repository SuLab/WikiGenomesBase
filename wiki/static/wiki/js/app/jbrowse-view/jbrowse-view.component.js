angular
    .module('jbrowseView')
    .component('jbrowseView', {
        template : '<iframe class="jbrowse" ng-src={{$ctrl.jbrowseURI()}}></iframe>',
        bindings : {
            gene : '<',
            refseq: '<'
        },
        controller : function() {

            var ctrl = this;

            ctrl.$onInit = function() {};

            ctrl.$onChanges = function() {
                if (ctrl.gene && ctrl.gene.taxid && ctrl.refseq) {
                    ctrl.jbrowseURI = function() {
                        var start = Number(ctrl.gene.genStart) - 1000;
                        var end = Number(ctrl.gene.genEnd) + 1000;

                        var loc = "";
                        var highlight = "";
                        if (start && end && ctrl.gene.refseqGenome) {
                            loc = "&loc=" + ctrl.gene.refseqGenome + ":" + start + '..' + end;
                            highlight = "&highlight=" + ctrl.gene.refseqGenome + ":" + Number(ctrl.gene.genStart) + '..' + Number(ctrl.gene.genEnd);
                        }

                        return "static/wiki/js/external_js/JBrowse-1.14.1/index.html?data=" + ctrl.gene.taxid +
                        "_data&tracks=DNA,genes,operons,mutants&menu=0" + loc + highlight;
                    };

                }

            };
        }
    });