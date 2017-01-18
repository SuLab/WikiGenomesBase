angular
    .module('jbrowseView')
    .component('jbrowseView', {
        template: '<iframe class="jbrowse" ng-src={{$ctrl.jbrowseURI()}}></iframe>',
        bindings: {
            org: '<'
        },
        controller: function () {
            var ctrl = this;
            ctrl.jbrowseURI = function() {
                return "static/wiki/js/JBrowse-1.12.1/index.html?data=sparql_data/sparql_data_"
                    + ctrl.org.taxid +
                    "&tracks=genes_canvas_mod,operons_canvas_mod&menu=0";
            };
        }
    });



