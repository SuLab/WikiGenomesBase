angular
    .module('historyView')
    .component('historyView', {
        templateUrl: '/static/build/js/angular_templates/history-view.min.html',
        controller: function (history, $sce, NgTableParams) {
            'use strict';
            var ctrl = this;

            ctrl.feed = [];

            ctrl.tableParams = new NgTableParams({}, {});

            ctrl.$onChanges = function() {
                if (ctrl.gene) {
                    history.getHistory(ctrl.gene).then(function (data) {
                        angular.forEach(data.query.pages, function(page) {
                            angular.forEach(page.revisions, function(revision) {
                                ctrl.feed.push({
                                    "user": revision.user,
                                    "timestamp": revision.timestamp,
                                    "parsedcomment": $sce.trustAsHtml(revision.parsedcomment)
                                });
                            });
                        });

                        ctrl.tableParams = new NgTableParams({},{dataset: ctrl.feed});
                    });
                }
                if (ctrl.protein) {
                    history.getHistory(ctrl.protein).then(function (data) {
                        angular.forEach(data.query.pages, function(page) {
                            angular.forEach(page.revisions, function(revision) {
                                ctrl.feed.push({
                                    "user": revision.user,
                                    "timestamp": revision.timestamp,
                                    "parsedcomment": $sce.trustAsHtml(revision.parsedcomment)
                                });
                            });
                        });

                        ctrl.tableParams = new NgTableParams({},{dataset: ctrl.feed});
                    });
                }
            };

        },
        bindings: {
            gene: '<',
            protein: '<'
        }
    });
