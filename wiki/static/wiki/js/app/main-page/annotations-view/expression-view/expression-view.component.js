angular
    .module('expressionView')
    .component('expressionView', {
        templateUrl: '/static/build/js/angular_templates/expression-view.min.html',
        bindings: {
            data: '<',
            gene: '<',
            belland: '<'
        },
        controller: function ($location) {
            'use strict';
            var ctrl = this;

            ctrl.callback = function() {
                var data = google.visualization.arrayToDataTable([
                    ['Hour', 'Expression'],
                    [1, ctrl.belland["1h"]],
                    [3, ctrl.belland["3h"]],
                    [8, ctrl.belland["8h"]],
                    [16, ctrl.belland["16h"]],
                    [24, ctrl.belland["24h"]],
                    [40, ctrl.belland["40h"]],
                ]);

                var options = {
                    title: 'Expression Timing for ' + ctrl.gene.locusTag,
                    titleTextStyle: {color: '#385d94', fontSize: 16, bold: true},
                    curveType: 'function',
                    hAxis: {title: "Time (hours)", showTextEvery: 1},
                    vAxis: {title: "Expression", viewWindow: {min: 0}},
                    legend: {position: "none"}
                };

                var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
                chart.draw(data, options);
            };

            ctrl.$onChanges = function () {
                if (ctrl.belland) {
                    google.charts.load('current', {packages: ["corechart"]});
                    google.charts.setOnLoadCallback(ctrl.callback);
                }
            };

            ctrl.checkAuthorization = function(modal) {
                if (!$location.path().includes("authorized")) {
                    alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                } else {
                    $("#" + modal).modal('show');
                }
            };
        }
    });
