angular
    .module('organismTree')
    .component('organismTree', {
        controller: function (orgTree) {
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
					orgTree.getOrgTree(function (data) {
                        ctrl.data.addRows(data.data);
                        drawChart();
					});

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
