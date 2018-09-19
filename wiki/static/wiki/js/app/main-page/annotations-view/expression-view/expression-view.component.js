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

            ctrl.lineChart = function() {
                ctrl.isLine = true;
                var data = google.visualization.arrayToDataTable([
                    ['Hour', 'Expression'],
                    [0, 0],
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

            ctrl.barChart = function() {
                ctrl.isLine = false;
                var data = google.visualization.arrayToDataTable([
                    ['Hour', 'Expression', { role: "style" }],
                    ["1h", ctrl.belland["1h"], "#385d94"],
                    ["3h", ctrl.belland["3h"], "#385d94"],
                    ["8h", ctrl.belland["8h"], "#385d94"],
                    ["16h", ctrl.belland["16h"], "#385d94"],
                    ["24h", ctrl.belland["24h"], "#385d94"],
                    ["40h", ctrl.belland["40h"], "#385d94"],
                ]);

                var options = {
                    title: 'Expression Timing for ' + ctrl.gene.locusTag,
                    titleTextStyle: {color: '#385d94', fontSize: 16, bold: true},
                    legend: {position: "none"},
                    bar: {groupWidth: "95%"}
                };

                var chart = new google.visualization.ColumnChart(document.getElementById('curve_chart'));
                chart.draw(data, options);
            };

            ctrl.$onChanges = function () {
                if (ctrl.belland) {
                    google.charts.load('current', {packages: ["corechart"]});
                    google.charts.setOnLoadCallback(ctrl.barChart);
                }
            };

            ctrl.checkAuthorization = function(modal) {
                if (!$location.path().includes("authorized")) {
                    alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                } else {
                    $("#" + modal).modal('show');
                }
            };

            ctrl.next = function() {
                if (ctrl.isLine) {
                    ctrl.barChart();
                } else {
                    ctrl.lineChart();
                }
            };
        }
    });
