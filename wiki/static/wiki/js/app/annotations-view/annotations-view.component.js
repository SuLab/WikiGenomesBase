angular
    .module('annotationsView')
    .component('annotationsView', {
        templateUrl : '/static/wiki/js/angular_templates/annotations-view.html',
        bindings : {
            data : '<',
            annotations : '<',
            org : '<',
            allorggenes : "<",
            hasprotein : "<"
        },
        controller : function() {

            'use strict';

            var ctrl = this;

            ctrl.$onChanges = function(changes) {
                if (changes.hasprotein) {
                    // settings for visibility of each annotation view
                    ctrl.settings = {
                        go : changes.hasprotein.currentValue,
                        operon : true,
                        interpro : changes.hasprotein.currentValue,
                        enzyme : changes.hasprotein.currentValue,
                        mutants : true,
                        pubs : true,
                        product : changes.hasprotein.currentValue,
                        ortholog : true,
                        expression : true,
                        hostpath : true
                    };
                }
            }

            ctrl.$onInit = function() {

                //buttons for expanding and collapsing accordion
                ctrl.expandAll = function() {
                    ctrl.toggleOpen(true);
                };
                ctrl.collapseAll = function() {
                    ctrl.toggleOpen(false);
                };
                ctrl.accordion = {
                    go : true,
                    operon : true,
                    interpro : true,
                    enzyme : true,
                    mutants : true,
                    pubs : true,
                    product : true,
                    ortholog : true,
                    expression : true,
                    hostpath : true
                };

                ctrl.toggleOpen = function(openAll) {
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
                    isCustomHeaderOpen : false,
                    isFirstOpen : true,
                    isFirstDisabled : false
                };
            };

        }
    });