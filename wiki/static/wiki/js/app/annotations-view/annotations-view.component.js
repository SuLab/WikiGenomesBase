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
            ctrl.$onInit = function () {
            };
            ctrl.$onChanges = function (changeObj) {
                if (changeObj.uniprot) {
                    console.log('uniprot changes');
                    GOTerms.getGoTerms(ctrl.uniprot).then(
                        function (data) {

                            ctrl.molfunc = [];
                            ctrl.bioproc = [];
                            ctrl.cellcomp = [];
                            ctrl.ecnumber = [];
                            ctrl.mf = 'mf_button';
                            ctrl.bp = 'bp_button';
                            ctrl.cc = 'cc_button';

                            angular.forEach(data, function (value, key) {
                                if (value.hasOwnProperty('ecnumber')) {
                                    ctrl.ecnumber.push(value.ecnumber.value);

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

                            InterPro.getInterPro(ctrl.uniprot).then(
                                function (data) {
                                    ctrl.ipData = data;
                                });

                            OperonData.getOperonData(ctrl.entrez).then(
                                function (data) {
                                    if (data.length > 0) {
                                        ctrl.opData = data;
                                        console.log(data);
                                    } else {
                                        ctrl.opData = [];
                                    }

                                });

                            ctrl.reaction = {};
                            if (ctrl.ecnumber.length > 0) {
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


                        });


                }


            };
        }
    });


