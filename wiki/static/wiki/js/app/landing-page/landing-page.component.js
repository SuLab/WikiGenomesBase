angular
    .module('landingPage')
    .component('landingPage', {
        controller : function(allChlamOrgs, recentChlamPubLinks, euroPubData, recentChanges, allChlamydiaGenes) {
            'use strict';
            var ctrl = this;
            ctrl.myInterval = 5000;
            ctrl.noWrapSlides = false;
            ctrl.active = 0;
            var currIndex = 0;

            ctrl.orgList = allChlamOrgs.getAllOrgs();
            recentChlamPubLinks.getRecentChlamPubLinks().then(function(data) {
                var pubs = data.data.esearchresult.idlist;
                ctrl.recentPubs = [];
                angular.forEach(pubs, function(value) {
                    euroPubData.getEuroPubData(value).then(function(data) {

                        if (data.data.resultList.result[0]) {
                            ctrl.recentPubs.push(data.data.resultList.result[0]);
                        }


                    }
                    );

                });
            });
            
            /*
            allChlamydiaGenes.getAllChlamGeneQIDS().then(function (data) {
            	var ids = [];
            	angular.forEach(data.data.results.bindings, function(obj) {
            		if (ids.length < 50) {
            			ids.push(obj.gene.value.substring(obj.gene.value.indexOf("Q")));
            		}
            	});
            	
                recentChanges.getRecentChanges(ids).then(function(data) {
                	console.log(data);
                });
                
            });*/

            // run the tutorial after clicking the button
            document.getElementById("get-started").onclick = function() {

                // set options for introjs
                var intro = introJs().setOption("skipLabel", "Skip Tutorial");
                intro.setOption("showStepNumbers", "false");
                intro.hideHints();

                // now start it
                intro.start();
            };

            // when the page is loaded, check whether or not to do the tutorial
            window.addEventListener('load', function() {
                if (localStorage.getItem('tutorial') != 'true') {

                    // set options for introjs
                    var intro = introJs().setOption("skipLabel", "Skip Tutorial");
                    intro.setOption("showStepNumbers", "false");
                    intro.hideHints();

                    // set a local variable to indicate the tutorial has been completed
                    intro.oncomplete(function() {
                        console.log("COMPLETED");
                        localStorage.setItem('tutorial', 'true');
                    });

                    // if the user stops the tutorial, treat it as completed
                    intro.onexit(function() {
                        console.log("EXIT");
                        localStorage.setItem('tutorial', 'true');
                    });

                    // now start it
                    intro.start();

                } else {
                    console.log("Tutorial already completed");
                }
            });
            
        },
        templateUrl : '/static/build/js/angular_templates/landing-page.min.html'
    });