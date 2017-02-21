angular
    .module('organismTree')
    .component('organismTree', {
        controller: function () {
            var ctrl = this;
            ctrl.$onInit = function () {
                google.charts.load('current', {packages: ["orgchart"]});
                google.charts.setOnLoadCallback(drawChart);

                function drawChart() {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Name');
                    data.addColumn('string', 'Parent');

                    // For each orgchart box, provide the name, manager, and tooltip to show.
                    data.addRows([
                        [{v: 'Chlamydia', f: '<div style="color:#385d94; font-style:italic">Chlamydia</div>'},
                            ''],
                        [{
                            v: 'Chlamydia trachomatis',
                            f: '<div style="color:#385d94; font-style:italic">Chlamydia trachomatis</div>'
                        },
                            'Chlamydia'],
                        [{
                            v: 'Chlamydia muridarum',
                            f: '<div style="color:#385d94; font-style:italic">Chlamydia muridarum</div>'
                        },
                            'Chlamydia'],
                        [{
                            v: 'Chlamydia pneumoniae',
                            f: '<div style="color:#385d94; font-style:italic">Chlamydia pneumoniae</div>'
                        },
                            'Chlamydia'],
                        [{
                            v: 'Chlamydia pneumoniae CWL029',
                            f: '<a href="/organism/115713/" style="color:#385d94; font-style:italic">Chlamydia pneumoniae CWL029</div>'
                        },
                            'Chlamydia pneumoniae'],
                        [{
                            v: 'Chlamydia muridarum Nigg',
                            f: '<a href="/organism/243161/"  style="color:#385d94; font-style:italic">Chlamydia muridarum Nigg</div>'
                        },
                            'Chlamydia muridarum'],
                        [{
                            v: 'Chlamydia trachomatis 434/BU',
                            f: '<a href="/organism/471472/" style="color:#385d94; font-style:italic">Chlamydia trachomatis 434/BU</a>'
                        },
                            'Chlamydia trachomatis'],
                        [{
                            v: 'Chlamydia trachomatis D/UW-3/CX',
                            f: '<a href="/organism/272561/" style="color:#385d94; font-style:italic">Chlamydia trachomatis D/UW-3/CX</>'
                        },
                            'Chlamydia trachomatis']


                    ]);

                    // Create the chart.
                    var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
                    // Draw the chart, setting the allowHtml option to true for the tooltips.
                    chart.draw(data, {allowHtml: true});
                }
            };

        },
        templateUrl: '/static/wiki/js/angular_templates/organism-tree.html',
        bindings: {
            orgs: '<'
        }
    });


