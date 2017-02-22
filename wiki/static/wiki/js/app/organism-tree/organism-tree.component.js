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
                        [{v: 'Chlamydia', f: '<div class="btn btn-default treeNode nohover" >Chlamydia</div>'},
                            ''],
                        [{
                            v: 'Chlamydia trachomatis',
                            f: '<div class="btn btn-default treeNode nohover" >Chlamydia trachomatis</div>'
                        },
                            'Chlamydia'],
                        [{
                            v: 'Chlamydia muridarum',
                            f: '<div class="btn btn-default treeNode nohover" >Chlamydia muridarum</div>'
                        },
                            'Chlamydia'],
                        [{
                            v: 'Chlamydia pneumoniae',
                            f: '<div class="btn btn-default treeNode nohover" >Chlamydia pneumoniae</div>'
                        },
                            'Chlamydia'],
                        [{
                            v: 'Chlamydia pneumoniae CWL029',
                            f: '<a class="btn btn-default treeNode" href="/organism/115713/" >Chlamydia pneumoniae CWL029</div>'
                        },
                            'Chlamydia pneumoniae'],
                        [{
                            v: 'Chlamydia muridarum Nigg',
                            f: '<a class="btn btn-default treeNode" href="/organism/243161/" >Chlamydia muridarum Nigg</div>'
                        },
                            'Chlamydia muridarum'],
                        [{
                            v: 'Chlamydia trachomatis 434/BU',
                            f: '<a  class="btn btn-default treeNode" href="/organism/471472/" >Chlamydia trachomatis 434/BU</a>'
                        },
                            'Chlamydia trachomatis'],
                        [{
                            v: 'Chlamydia trachomatis D/UW-3/CX',
                            f: '<a  class="btn btn-default treeNode" href="/organism/272561/" >Chlamydia trachomatis D/UW-3/CX</>'
                        },
                            'Chlamydia trachomatis']


                    ]);
                    var options = {
                        nodeClass: 'none',
                        allowHtml: true
                    };
                    // Create the chart.
                    var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
                    console.log(chart);
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


