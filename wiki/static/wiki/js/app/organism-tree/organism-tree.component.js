angular
    .module('organismTree')
    .component('organismTree', {
        controller: function () {
            var ctrl = this;
            ctrl.$onInit = function () {
                google.charts.load('current', {packages: ["orgchart"]});
                google.charts.setOnLoadCallback(drawChart);

                function drawChart() {
                    var orgTreeChart = new google.visualization.DataTable();
                    orgTreeChart.addColumn('string', 'Name');
                    orgTreeChart.addColumn('string', 'Parent');

                    // For each orgchart box, provide the name, manager, and tooltip to show.
                    orgTreeChart.addRows([
                        ['Chlamydia', ''],
                        ['Chlamydia trachomatis', 'Chlamydia'],
                        ['Chlamydia muridarum', 'Chlamydia'],
                        ['Chlamydia pneumoniae', 'Chlamydia'],
                        ['<a style="color:#385d94" href="/organism/471472">Chlamydia trachomatis 434/BU</a>', 'Chlamydia trachomatis'],
                        ['<a style="color:#385d94" href="/organism/272561">Chlamydia trachomatis D/UW-3/CX</a>', 'Chlamydia trachomatis'],
                        ['<a style="color:#385d94" href="/organism/272561">Chlamydia muridarum Nigg</a>', 'Chlamydia muridarum'],
                        ['<a style="color:#385d94" href="/organism/243161">Chlamydia pneumoniae CWL029</a>', 'Chlamydia pneumoniae']

                    ]);
                    var options = {
                        'color': 'whitesmoke',
                        'allowHtml': true,
                        'size': 'large',
                        'nodeClass': 'panel'

                    };
                    // Create the chart.
                    var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
                    // Draw the chart, setting the allowHtml option to true for the tooltips.
                    chart.draw(orgTreeChart, options);
                }
            };


        },
        templateUrl: '/static/wiki/js/angular_templates/organism-tree.html',
        bindings: {
            orgs: '<'
        }
    });


