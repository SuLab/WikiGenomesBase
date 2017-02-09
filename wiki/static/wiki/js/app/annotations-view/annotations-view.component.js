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

            ctrl.$onInit = function () {

            };
            ctrl.$onChanges = function (changeObj) {
                if (changeObj.uniprot) {
                    GOTerms.getGoTerms(ctrl.uniprot).then(
                        function (data) {

                            ctrl.mf = 'mf_button';
                            ctrl.bp = 'bp_button';
                            ctrl.cc = 'cc_button';

                            angular.forEach(data.data.results.bindings, function (value, key) {
                                console.log(value);
                                if (value.hasOwnProperty('ecnumber')) {
                                    ctrl.ecnumber.push(value.ecnumber.value);
                                    console.log(value.ecnumber.value);
                                }
                                ctrl.reaction = {};
                                if (ctrl.ecnumber.length > 0) {
                                    console.log(ctrl.ecnumber);
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
                        });

                    OperonData.getOperonData(ctrl.entrez).then(
                        function (data) {
                            if (data.length > 0) {
                                ctrl.opData = data;
                            } else {
                                ctrl.opData = [];
                            }

                        });


                }

            };
        }
    });


