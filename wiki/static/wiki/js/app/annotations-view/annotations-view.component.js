angular
    .module('annotationsView')
    .component('annotationsView', {
        templateUrl: '/static/wiki/js/angular_templates/annotations-view.html',
        bindings: {
            uniprot: '<',
            entrez: '<'
        },
        controller: function (GOTerms, InterPro, OperonData) {
            var ctrl = this;
            ctrl.$onInit = function () {
            };
            ctrl.$onChanges = function (changeObj) {
                if (changeObj.uniprot) {
                    GOTerms.getGoTerms(ctrl.uniprot).then(
                        function (data) {
                            ctrl.molfunc = [];
                            ctrl.bioproc = [];
                            ctrl.cellcomp =[];
                            angular.forEach(data, function (value, key) {
                                if (value.goclass.value === 'http://www.wikidata.org/entity/Q5058355'){
                                    ctrl.cellcomp.push(value);
                                }
                                if (value.goclass.value === 'http://www.wikidata.org/entity/Q14860489'){
                                    ctrl.molfunc.push(value);
                                }
                                if (value.goclass.value === 'http://www.wikidata.org/entity/Q2996394'){
                                    ctrl.bioproc.push(value);
                                }
                            });
                            ctrl.goData = data;
                        });
                    InterPro.getInterPro(ctrl.uniprot).then(
                        function (data) {
                            ctrl.ipData = data;
                        });

                    OperonData.getOperonData(ctrl.entrez).then(
                        function (data) {
                            ctrl.opData = data;
                        });




                }
            };
        }
    });