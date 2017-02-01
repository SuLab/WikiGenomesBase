angular
    .module('goForm')
    .component('goForm', {
        controller: function ($http, evidenceCodes, goFormData) {
            var ctrl = this;
            var goClassMap = {
                    'mf_button' : 'Q14860489',
                    'cc_button' : 'Q5058355',
                    'bp_button' : 'Q2996394'
                };
            ctrl.formData = {};


            evidenceCodes.getevidenceCodes(function (data) {
                    ctrl.evidence = data;
                });

            ctrl.goInput = angular.element(window).find('#goInput');
            ctrl.eviInput = angular.element(window).find('#eviInput');
            ctrl.goInput = angular.element(window).find('#pubInput');

            ctrl.getGoTerm = function (val) {
                var endpoint = 'https://query.wikidata.org/sparql?format=json&query=';
                   var url = endpoint + encodeURIComponent("SELECT DISTINCT ?goterm ?goID ?goterm_label " +
                           "WHERE { ?goterm wdt:P279* wd:" + goClassMap[ctrl.goclass] + "; " +
                           "rdfs:label ?goterm_label; wdt:P686 ?goID. " +
                           "FILTER(lang(?goterm_label) = 'en') " +
                           "FILTER(CONTAINS(LCASE(?goterm_label), '" +
                           val.toLowerCase() + "' ))}"
                       );
                return $http.get(url).then(function (response) {
                    return response.data.results.bindings.map(function (item) {
                        return item;
                    });
                });
            };

            ctrl.getPMID = function (val) {
                var endpoint = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=';
                var url = endpoint + val;
                return $http.get(url).then(function (response) {
                    var resultData = [response.data.result[val]];
                    return resultData.map(function (item) {
                        return item;
                    });
                });

            };

            ctrl.sendData = function (formData) {
                console.log(formData);
                ctrl.goFormModel = null;
                goFormData.getgoFormData('/wd_go_edit', formData).then(function(data){
                    console.log(data);
                });




            };







        },
        templateUrl: '/static/wiki/js/angular_templates/go-form.html',
        bindings: {
            goclass: '<'
        }

    });
