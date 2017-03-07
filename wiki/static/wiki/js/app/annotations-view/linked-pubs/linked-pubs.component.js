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

                    ctrl.gene.locusTag = ctrl.gene.locusTag.replace('_','');
                    locusTag2Pub.getlocusTag2Pub(ctrl.gene.locusTag).then(function (data) {
                        ctrl.pubList = data.data.resultList.result;
                    });
                }
            };
        }
    });
