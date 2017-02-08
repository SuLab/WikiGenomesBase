angular
    .module('browserPage')
    .component('browserPage', {
        controller: function ($filter, $location, allOrgs,
                              allOrgGenes, currentGene, currentOrg,
                              currentOrgFetch) {
            var ctrl = this;

            ctrl.$onInit = function () {
                allOrgs.getAllOrgs(function (data) {
                    ctrl.orgList = data;
                });
                ctrl.currentTaxid = $location.path().split("/")[2];
                allOrgGenes.getAllOrgGenes(ctrl.currentTaxid)
                    .then(function (data) {
                        ctrl.currentAllGenes = data.data.results.bindings;
                        console.log(ctrl.currentAllGenes);
                    });
                ctrl.currentOrg = currentOrg;
                ctrl.currentGene = currentGene;

                currentOrgFetch.getCurrentOrg(ctrl.currentTaxid).then(function (data) {
                    currentOrg.taxon = data.taxon;
                    currentOrg.taxid = data.taxid;
                    currentOrg.taxonLabel = data.taxonLabel;
                });
            };


        },
        templateUrl: '/static/wiki/js/angular_templates/browser-page.html'
    });

var app = angular.module('myApp', []);

// alternate - https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination
// alternate - http://fdietz.github.io/recipes-with-angular-js/common-user-interface-patterns/paginating-through-client-side-data.html
