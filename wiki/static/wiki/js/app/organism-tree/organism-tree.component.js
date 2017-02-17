angular
    .module('organismTree')
    .component('organismTree', {
        controller: function ($location) {
            var ctrl = this;
            var body = d3.select('#orgtree').select('#org2');
            console.log(body);


        },
        templateUrl: '/static/wiki/js/angular_templates/organism-tree.html',
        bindings: {
            orgs: '<'
        }
    });
