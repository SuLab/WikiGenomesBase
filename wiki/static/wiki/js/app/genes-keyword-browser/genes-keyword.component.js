angular
    .module('genesKeyword')
    .component('genesKeyword', {
        controller: function ($location, $filter, allChlamOrgs, allChlamydiaGenes) {
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.keyword = $location.path().split("/")[2];
                console.log(ctrl.keyword);
                //allChlamOrgs.getAllOrgs(function (data) {
                //    ctrl.orgList = data;
                //});
                ctrl.getChlamGenes = allChlamydiaGenes.getAllChlamGenes().then(
                    function (data) {
                        ctrl.chlamGenes = data.data.results.bindings;
                        ctrl.keywordList = $filter('keywordFilter')(ctrl.chlamGenes, ctrl.keyword);
                        console.log(ctrl.keywordList.length);

                    });

                ctrl.onSelect = function ($item) {
                    $location.path('/organism/' + $item.taxid.value + "/gene/" + $item.entrez.value);
                };
            };
        },
        templateUrl: '/static/wiki/js/angular_templates/genes-keyword-browser.html'
    });
