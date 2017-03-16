angular
    .module('orthologView')
    .component('orthologView', {
        bindings: {
            data: '<'
        },
        controller: function ($filter) {
            var ctrl = this;
            ctrl.$onInit = function () {
                //var current = $filter('keywordFilter')(ctrl.data, ctrl.gene.locusTag);
                //ctrl.currentOrtholog = {};
                //angular.forEach(current[0], function (value, key) {
                //    if (key != '_id' && key != '$oid' && key != 'timestamp') {
                //        ctrl.currentOrtholog[key] = value
                //    }
                //});
            };
        },
        templateUrl: '/static/wiki/js/angular_templates/ortholog-view.html'
    });
