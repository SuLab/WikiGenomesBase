angular
    .module('browserPage')
    .component('browserPage', {
        controller: function ($filter, $location, allChlamOrgs, allOrgGenes) {
            //Browser page Component.  Directed here to paginated list of genes when organism is selected from landing page,
            //or when browser is pointed to URL with /organism/<valid-taxid>
            //The component parses the URL to determine the current organism taxid and uses that to look up all genes and load
            //them into pagination, as well as launches JBrowse
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.currentTaxid = $location.path().split("/")[2];
                allChlamOrgs.getAllOrgs(function (data) {
                    ctrl.orgList = data;
                    ctrl.currentOrg = $filter('getJsonItemOrg')('taxid', ctrl.currentTaxid, ctrl.orgList);
                    if (ctrl.currentOrg == undefined) {
                        alert("not a valid taxonomy id");
                        $location.path('/');
                    }
                });
                allOrgGenes.getAllOrgGenes(ctrl.currentTaxid)
                    .then(function (data) {
                        var dataResults = data.data.results.bindings;
                        console.log(dataResults[0]);
                        console.log('hello');
                        ctrl.currentAllGenes = $filter('orderObjectBy')(dataResults, 'genStart');
                        ctrl.initialGene = ctrl.currentAllGenes[0];

                    });
                ctrl.onSelect = function ($item) {
                    $location.path('/organism/' + ctrl.currentTaxid + "/gene/" + $item.entrez.value);
                };
            };
        },
        templateUrl: '/static/wiki/js/angular_templates/browser-page.html'
    });
