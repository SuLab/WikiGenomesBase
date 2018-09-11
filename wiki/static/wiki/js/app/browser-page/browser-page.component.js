angular
    .module('browserPage')
    .component('browserPage', {
        controller: function ($filter, $location, $routeParams, allOrgs, allOrgGenes, appData, RefSeqChrom) {
            'use strict';
            //Browser page Component.  Directed here to paginated list of genes when organism is selected from landing page,
            //or when browser is pointed to URL with /organism/<valid-taxid>
            //The component parses the URL to determine the current organism taxid and uses that to look up all genes and load
            //them into pagination, as well as launches JBrowse
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.loading = true;
                ctrl.currentTaxid = $routeParams.taxid;
                ctrl.selected = "";

                appData.getAppData(function (data) {
                    ctrl.appData = data;

                    ctrl.onSelect = function ($item) {
                        if (data.primary_identifier == "locus_tag") {
                            $location.path('/organism/' + ctrl.currentTaxid + "/gene/" + $item.locusTag.value);
                        } else {
                            $location.path('/organism/' + ctrl.currentTaxid + "/gene/" + $item.entrez.value);
                        }
                    };

                    if (data.multiple_chromosomes_display) {
                        ctrl.chromosomes = [];
                        ctrl.numChromosomes = 0;
                        var row = 0;
                        var col = 0;
                        RefSeqChrom.getAllChromosomes(ctrl.currentTaxid).then(function (data) {
                            angular.forEach(data, function (chr) {
                                if (col >= 4) {
                                    row++;
                                    col = 0;
                                }
                                if (col == 0) {
                                    ctrl.chromosomes.push([]);
                                }
                                ctrl.chromosomes[row].push(chr);
                                col++;
                                ctrl.numChromosomes++;
                            });

                            // select the first chromosome
                            ctrl.onChromSelect(ctrl.chromosomes[0][0]);
                        });

                        ctrl.plasmids = [];
                        ctrl.numPlasmids = 0;
                        // relabel row and col to i, j because two async methods modify same vars at once
                        var i = 0;
                        var j = 0;
                        RefSeqChrom.getAllPlasmids(ctrl.currentTaxid).then(function (data) {
                            angular.forEach(data, function (chr) {
                                if (j >= 4) {
                                    i++;
                                    j = 0;
                                }
                                if (j == 0) {
                                    ctrl.plasmids.push([]);
                                }
                                ctrl.plasmids[i].push(chr);
                                ctrl.numPlasmids++;
                                j++;
                            });

                        });
                    } else {

                        allOrgGenes.getAllOrgGenes(ctrl.currentTaxid)
                            .then(function (data) {
                                ctrl.currentAllGenes = data.data.results.bindings;
                                ctrl.initialGene = ctrl.currentAllGenes[0];
                            }).finally(function () {
                            ctrl.loading = false;
                        });
                    }

                });

                ctrl.onChromSelect = function (chr) {
                    ctrl.loading = true;
                    ctrl.currentAllGenes = [];
                    allOrgGenes.getAllChromosomeGenes(chr.refseq.value).then(function (data) {
                        ctrl.currentAllGenes = data.data.results.bindings;

                        if (chr.chromosomeLabel) {
                            ctrl.selected = chr.chromosomeLabel.value;
                        } else {
                            ctrl.selected = chr.plasmidLabel.value;
                        }
                    }).finally(function () {
                        ctrl.loading = false;

                        if (ctrl.initialGene == undefined) {
                            ctrl.initialGene = ctrl.currentAllGenes[0];
                        }
                    });
                };

                // verify valid taxonomy id
                allOrgs.getAllOrgs(function (data) {
                    ctrl.orgList = data;
                    ctrl.currentOrg = $filter('getJsonItemOrg')('taxid', ctrl.currentTaxid, ctrl.orgList);
                    if (ctrl.currentOrg == undefined) {
                        alert("not a valid taxonomy id");
                        $location.path('/');
                    }
                });

            };
        },
        templateUrl: '/static/build/js/angular_templates/browser-page.min.html'
    });
