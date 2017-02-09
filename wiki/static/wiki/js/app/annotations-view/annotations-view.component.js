angular
    .module('annotationsView')
    .component('annotationsView', {
        templateUrl: '/static/wiki/js/angular_templates/annotations-view.html',
        bindings: {
            uniprot: '<',
            entrez: '<',
            gene: '<'
        },
        controller: function (GOTerms, InterPro, OperonData, expasyData) {
            var ctrl = this;
            ctrl.ecnumber = [];
            ctrl.molfunc = [];
            ctrl.bioproc = [];
            ctrl.cellcomp = [];
            ctrl.accordion = {
                go: false,
                operon: false,
                interpro: false,
                enzyme: false
            };

            ctrl.$onInit = function () {


            };
            ctrl.$onChanges = function (changeObj) {
                if (changeObj.uniprot) {
                    GOTerms.getGoTerms(ctrl.uniprot).then(
                        function (data) {
                            ctrl.mf = 'mf_button';
                            ctrl.bp = 'bp_button';
                            ctrl.cc = 'cc_button';
                            var dataResults = data.data.results.bindings;
                            if (dataResults.length > 0){
                                ctrl.accordion.go = true;
                            }
                            angular.forEach(dataResults, function (value, key) {
                                console.log(value);
                                if (value.hasOwnProperty('ecnumber')) {
                                    ctrl.ecnumber.push(value.ecnumber.value);
                                    console.log(value.ecnumber.value);
                                }
                                ctrl.reaction = {};
                                if (ctrl.ecnumber.length > 0) {
                                    ctrl.accordion.enzyme = true;
                                    angular.forEach(ctrl.ecnumber, function (value) {
                                        if (value.indexOf('-') > -1) {
                                            var multiReactions = "view reactions hierarchy at: http://enzyme.expasy.org/EC/" + value;
                                            ctrl.reaction[value] = [multiReactions];
                                        } else {
                                            expasyData.getReactionData(value).then(function (data) {
                                                ctrl.reaction[data.ecnumber] = data.reaction;

                                            });
                                        }
                                    });
                                } else {
                                    ctrl.reaction['No Data'] = ['---------'];
                                }

                                if (value.goclass.value === 'http://www.wikidata.org/entity/Q5058355') {
                                    ctrl.cellcomp.push(value);

                                }
                                if (value.goclass.value === 'http://www.wikidata.org/entity/Q14860489') {
                                    ctrl.molfunc.push(value);

                                }
                                if (value.goclass.value === 'http://www.wikidata.org/entity/Q2996394') {
                                    ctrl.bioproc.push(value);

                                }

                            });

                        });

                    InterPro.getInterPro(ctrl.uniprot).then(
                        function (data) {
                            ctrl.ipData = data;
                            if (ctrl.ipData.length > 0){
                                ctrl.accordion.interpro = true;
                            }
                        });


                    OperonData.getOperonData(ctrl.entrez).then(
                        function (data) {
                            if (data.length > 0) {
                                ctrl.opData = data;
                                ctrl.accordion.operon = true;
                            } else {
                                ctrl.opData = [];
                            }

                        });

                    //buttons for expanding and collapsing accordion


                    ctrl.expandAll = function () {
                        ctrl.toggleOpen(true);
                    };

                    ctrl.collapseAll = function () {
                        ctrl.toggleOpen(false);
                    };
                    ctrl.toggleOpen = function (openAll) {
                        ctrl.accordion.go = openAll;
                        ctrl.accordion.operon = openAll;
                        ctrl.accordion.interpro = openAll;
                        ctrl.accordion.enzyme = openAll
                    };
                }

            };
        }
    });


