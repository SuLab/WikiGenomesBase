angular
    .module('organismTree')
    .component('organismTree', {
        controller: function () {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function () {
            	
                google.charts.load('current', {packages: ["orgchart"]});
                google.charts.setOnLoadCallback(init);
                
                function init() {
                
	                ctrl.data = new google.visualization.DataTable();
	                ctrl.data.addColumn('string', 'Name');
	                ctrl.data.addColumn('string', 'Parent');
	
	                // For each orgchart box, provide the name, manager, and tooltip to show.
	                ctrl.data.addRows([
	                    [{v: 'Chlamydia', f: '<div class="btn btn-default treeNode nohover" ><i>Chlamydia</i></div>'},
	                        ''],
	                    [{
	                        v: 'Chlamydia trachomatis',
	                        f: '<div class="btn btn-default treeNode nohover" ><i>Chlamydia trachomatis</i></div>'
	                    },
	                        'Chlamydia'],
	                    [{
	                        v: 'Chlamydia muridarum',
	                        f: '<div class="btn btn-default treeNode nohover" ><i>Chlamydia muridarum</i></div>'
	                    },
	                        'Chlamydia'],
	                    [{
	                        v: 'Chlamydia pneumoniae',
	                        f: '<div class="btn btn-default treeNode nohover" ><i>Chlamydia pneumoniae</i></div>'
	                    },
	                        'Chlamydia'],
	                    [{
	                        v: 'Chlamydia pneumoniae CWL029',
	                        f: '<div class="btn btn-default treeNode link"><a href="/organism/115713/" ><i>Chlamydia pneumoniae CWL029</i></div>'
	                    },
	                        'Chlamydia pneumoniae'],
	                    [{
	                        v: 'Chlamydia muridarum Nigg',
	                        f: '<div class="btn btn-default treeNode link"><a href="/organism/243161/" ><i>Chlamydia muridarum Nigg</i></div>'
	                    },
	                        'Chlamydia muridarum'],
	                    [{
	                        v: 'Chlamydia trachomatis 434/BU',
	                        f: '<div class="btn btn-default treeNode link"><a href="/organism/471472/" ><i>Chlamydia trachomatis 434/BU</i></a></div>'
	                    },
	                        'Chlamydia trachomatis'],
	                    [{
	                        v: 'Chlamydia trachomatis D/UW-3/CX',
	                        f: '<div class="btn btn-default treeNode link"><a href="/organism/272561/" ><i>Chlamydia trachomatis D/UW-3/CX</i></a></div>'
	                    },
	                        'Chlamydia trachomatis']
	
	
	                ]);
	                
	                drawChart();
	                
	                // resizing not working with org charts
	                //window.onresize = drawChart;
                }
                
                function drawChart() {
                	
                	var options = {
                		allowHtml: true,
                		size: 'medium'
                	};
                	
                    // Create the chart.
                    var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
                    console.log(chart);
                    // Draw the chart, setting the allowHtml option to true for the tooltips.
                    chart.draw(ctrl.data, options);
                }
                
            };

        },
        templateUrl: '/static/build/js/angular_templates/organism-tree.min.html',
        bindings: {
            orgs: '<'
        }
    });


