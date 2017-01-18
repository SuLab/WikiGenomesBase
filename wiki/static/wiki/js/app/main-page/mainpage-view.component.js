//angular
//    .module('mainPage')
//    .component('mainPage', {
//        controller: function (currentOrg, currentGene, allOrgs, currentAllGenes, allOrgGenes) {
//
//            var ctrl = this;
//            ctrl.currentOrg = currentOrg;
//            ctrl.currentGene = currentGene;
//            currentAllGenes.allGenes = allOrgGenes.getAllOrgGenes(ctrl.currentOrg);
//            currentAllGenes.allGenes.then(function (data) {
//                ctrl.currentAllGenes = data;
//            });
//
//            allOrgs.getAllOrgs(function (data) {
//                ctrl.orgList = data;
//            });
//        },
//        templateUrl: '/static/wiki/js/angular_templates/main-page.html'
//    });
angular
    .module('mainPage')
    .component('mainPage', {
        bindings: {
            org: '<'
        },
        controller: function (allOrgs, currentGene, currentOrg) {
            var ctrl = this;
            ctrl.$onInit = function () {
                allOrgs.getAllOrgs(function (data) {
                    ctrl.orgList = data;
                });
                ctrl.currentOrg = currentOrg;
                ctrl.currentGene = currentGene;

            };


        },
        templateUrl: '/static/wiki/js/angular_templates/main-page.html'
    });
