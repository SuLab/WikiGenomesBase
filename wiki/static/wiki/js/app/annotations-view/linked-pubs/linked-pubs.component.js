angular
    .module('linkedPubs')
    .component('linkedPubs', {
        templateUrl: '/static/wiki/js/angular_templates/linked-pubs.html',
        bindings: {
            gene: '<',
            entrez: '<'
        },
        controller: function ($filter, pubLinks, euroPubData, locusTag2Pub) {
            var ctrl = this;

            ctrl.$onInit = function () {
            };
            ctrl.$onChanges = function (changesObj) {
                if (changesObj.entrez) {
                    var locus_tag = ctrl.gene.locusTag.replace('_','');
                    locusTag2Pub.getlocusTag2Pub(locus_tag).then(function (data) {
                        ctrl.pubList = data.data.resultList.result;
                    });
                }
            };
        }
    });
