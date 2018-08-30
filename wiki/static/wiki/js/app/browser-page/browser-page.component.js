angular
    .module('browserPage')
    .component('browserPage', {
        controller: function ($filter, $location, $routeParams, allOrgs, allOrgGenes, appData) {
            'use strict';
            //Browser page Component.  Directed here to paginated list of genes when organism is selected from landing page,
            //or when browser is pointed to URL with /organism/<valid-taxid>
            //The component parses the URL to determine the current organism taxid and uses that to look up all genes and load
            //them into pagination, as well as launches JBrowse
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.loading = true;
                ctrl.currentTaxid = $routeParams.taxid;
                appData.getAppData(function (data) {
                    ctrl.appData = data;
                });
                allOrgs.getAllOrgs(function (data) {
                    ctrl.orgList = data;
                    ctrl.currentOrg = $filter('getJsonItemOrg')('taxid', ctrl.currentTaxid, ctrl.orgList);
                    if (ctrl.currentOrg == undefined) {
                        alert("not a valid taxonomy id");
                        $location.path('/');
                    }
                });
                allOrgGenes.getAllOrgGenes(ctrl.currentTaxid)
                    .then(function (data) {
                        ctrl.currentAllGenes = data.data.results.bindings;
                        ctrl.initialGene = ctrl.currentAllGenes[0];
                    }).finally(function(){
                        ctrl.loading = false;
                    });
                ctrl.onSelect = function ($item) {
                    $location.path('/organism/' + ctrl.currentTaxid + "/gene/" + $item.locusTag.value);
                };
            };
        },
        templateUrl: '/static/build/js/angular_templates/browser-page.min.html'
    });
