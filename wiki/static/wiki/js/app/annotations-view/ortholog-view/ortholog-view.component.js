angular.module('orthologView')

    .component('orthologView',
        {
            bindings : {
                locusTag : '<',
                taxId : '<'
            },
            controller : "orthologCtrl",
            templateUrl : '/static/wiki/js/angular_templates/ortholog-view.html'
        })

    .controller('orthologCtrl', function(orthoData) {
        
        'use strict';

        var ctrl = this;
        
        // Get ortholog data from wikidata
        ctrl.data = {};
        console.log(ctrl.locusTag);
        orthoData.getOrthologs(ctrl.locusTag).then(function(response) {
            
            // first add current current gene
            ctrl.data[ctrl.taxId] = ctrl.locusTag;
            
            // now add results from sparql query
            angular.forEach(response.results.bindings, function(obj) {
                ctrl.hasOrthologs = true;
                var tax = obj.orthoTaxid.value;
                var tag = obj.orthoLocusTag.value;
                ctrl.data[tax] = tag;
            });
            
        });

        // config settings for table
        ctrl.tSettings = {
            "strain" : true,
            "tax" : true,
            "cLocus" : true,
            "dLocus" : false,
            "identity" : false,
            "length" : false,
            "eval" : false,
            "ref" : true
        };

    });