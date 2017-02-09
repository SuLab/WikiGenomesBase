angular
    .module('browserPage')
    .component('browserPage', {
        controller: function ($filter, $location, allOrgs,
                              allOrgGenes) {
            var ctrl = this;

            ctrl.$onInit = function () {
                ctrl.currentTaxid = $location.path().split("/")[2];
                console.log(ctrl.currentTaxid);
                allOrgs.getAllOrgs(function (data) {
                    ctrl.orgList = data;
                    console.log(ctrl.orgList);
                    ctrl.currentOrg = $filter('getJsonItemOrg')('taxid', ctrl.currentTaxid, ctrl.orgList);
                    console.log(ctrl.currentOrg);
                    if (ctrl.currentOrg == undefined) {
                        alert("not a valid taxonomy id");
                        $location.path('/');
                    }
                });

                allOrgGenes.getAllOrgGenes(ctrl.currentTaxid)
                    .then(function (data) {
                        var dataResults = data.data.results.bindings;
                        ctrl.currentAllGenes = $filter('orderObjectBy')(dataResults, 'genStart');
                    });
                ctrl.onSelect = function ($item) {
                    console.log($item);
                    $location.path('/organism/' + ctrl.currentTaxid + "/gene/" + $item.entrez.value);
                };


            };


        },
        templateUrl: '/static/wiki/js/angular_templates/browser-page.html'
    });
