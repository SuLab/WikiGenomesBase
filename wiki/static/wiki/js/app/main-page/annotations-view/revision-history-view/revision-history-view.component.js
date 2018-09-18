angular
    .module('historyView')
    .component('historyView', {
        templateUrl: '/static/build/js/angular_templates/history-view.min.html',
        controller: function (history, $sce) {
            'use strict';
            var ctrl = this;

            //var example = {"batchcomplete":"","query":{"pages":{"56025657":{"pageid":56025657,"ns":0,"title":"Q56079377","revisions":[{"user":"Djow2019","timestamp":"2018-09-17T23:01:39Z","parsedcomment":"\u200e<span dir=\"auto\"><span class=\"autocomment\">Changed claim: </span></span> <a href=\"/wiki/Property:P1651\" title=\"Property:P1651\">Property:P1651</a>: 3rxwDk1-6tc"},{"user":"Djow2019","timestamp":"2018-09-17T23:01:27Z","parsedcomment":"\u200e<span dir=\"auto\"><span class=\"autocomment\">Created claim: </span></span> <a href=\"/wiki/Property:P1651\" title=\"Property:P1651\">Property:P1651</a>: v=3rxwDk1-6tc"},{"user":"MicrobeBot","timestamp":"2018-09-12T19:53:55Z","parsedcomment":"\u200e<span dir=\"auto\"><span class=\"autocomment\">Updated item</span></span>"},{"user":"MicrobeBot","timestamp":"2018-08-28T21:23:21Z","parsedcomment":"\u200e<span dir=\"auto\"><span class=\"autocomment\">Updated item</span></span>"},{"user":"MicrobeBot","timestamp":"2018-08-16T01:40:53Z","parsedcomment":"\u200e<span dir=\"auto\"><span class=\"autocomment\">Updated item</span></span>"},{"user":"MicrobeBot","timestamp":"2018-08-14T03:03:56Z","parsedcomment":"\u200e<span dir=\"auto\"><span class=\"autocomment\">Created a new item</span></span>"}]}}}};
            ctrl.feed = [];

            /*angular.forEach(example.query.pages["56025657"].revisions, function(revision) {
                ctrl.feed.push({
                    "user": revision.user,
                    "timestamp": revision.timestamp,
                    "parsedcomment": $sce.trustAsHtml(revision.parsedcomment)
                });
            });*/

            ctrl.$onChanges = function() {
                if (ctrl.gene) {
                    history.getHistory(ctrl.gene).then(function (data) {
                        angular.forEach(data.revisions, function(revision) {
                           ctrl.feed.push({
                               "user": revision.user,
                               "timestamp": revision.timestamp,
                               "parsedcomment": $sce.trustAsHtml(revision.parsedcomment)
                           });
                        });
                    });
                }
                if (ctrl.protein) {
                    history.getHistory(ctrl.protein).then(function (data) {
                        angular.forEach(data.revisions, function(revision) {
                            ctrl.feed.push({
                                "user": revision.user,
                                "timestamp": revision.timestamp,
                                "parsedcomment": $sce.trustAsHtml(revision.parsedcomment)
                            });
                        });
                    });
                }
            };

        },
        bindings: {
            gene: '<',
            protein: '<'
        }
    });
