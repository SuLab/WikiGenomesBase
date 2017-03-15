angular
    .module('orthologView')
    .component('orthologView', {
        bindings: {
            gene: '<',
            data: '<'
        },
        controller: function ($filter) {
            var ctrl = this;
            var current = $filter('keywordFilter')(ctrl.data, ctrl.gene.locusTag);
            ctrl.currentOrtholog = {};
            angular.forEach(current[0], function(value, key){
                if(key != '_id' && key != '$oid' && key != 'timestamp'){
                    ctrl.currentOrtholog[key] = value
                }
            });
            console.log(ctrl.currentOrtholog);
        },
        templateUrl: '/static/wiki/js/angular_templates/ortholog-view.html'
    });
