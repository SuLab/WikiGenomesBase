angular
    .module('annotationsView')
    .component('annotationsView', {
        templateUrl: '/static/wiki/js/angular_templates/annotations-view.html',
        bindings: {
            data: '<',
            annotations: '<',
            org: '<',
            allorggenes: "<"
        },
        controller: function () {
            var ctrl = this;
            
            // settings for visibility of each annotation view
            ctrl.settings = {
                    go: true,
                    operon: true,
                    interpro: true,
                    enzyme: true,
                    mutants: true,
                    pubs: true,
                    product: true,
                    ortholog: true,
                    expression: true,
                    hostpath: true
            };
            
            ctrl.$onInit = function () {

                //buttons for expanding and collapsing accordion
                ctrl.expandAll = function () {
                    ctrl.toggleOpen(true);
                };
                ctrl.collapseAll = function () {
                    ctrl.toggleOpen(false);
                };
                ctrl.accordion = {
                    go: true,
                    operon: true,
                    interpro: true,
                    enzyme: true,
                    mutants: true,
                    pubs: true,
                    product: true,
                    ortholog: true,
                    expression: true,
                    hostpath: true
                };

                ctrl.toggleOpen = function (openAll) {
                    ctrl.accordion.go = openAll;
                    ctrl.accordion.operon = openAll;
                    ctrl.accordion.interpro = openAll;
                    ctrl.accordion.enzyme = openAll;
                    ctrl.accordion.mutants = openAll;
                    ctrl.accordion.pubs = openAll;
                    ctrl.accordion.product = openAll;
                    ctrl.accordion.ortholog = openAll;
                    ctrl.accordion.hostpath = openAll;
                    ctrl.accordion.expression = openAll;
                };

                ctrl.status = {
                    isCustomHeaderOpen: false,
                    isFirstOpen: true,
                    isFirstDisabled: false
                };
            };

        }
    });


