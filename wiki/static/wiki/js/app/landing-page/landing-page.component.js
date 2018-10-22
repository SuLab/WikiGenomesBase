angular
    .module('landingPage')
    .component('landingPage', {
        controller: function (allOrgs, recentPubLinks, euroPubData, appData, strainDisplay, iconMap) {
            'use strict';
            var ctrl = this;

            strainDisplay.getStrains().then(function (data) {
               ctrl.strains = data.data;
            });

            iconMap.getMap(function(data) {
                ctrl.iconMap = data;
            });

            appData.getAppData(function (data) {
                ctrl.appData = data;
                recentPubLinks.getRecentPubLinks(data.newsfeed_search_term, data.newsfeed_recent_days, data.newsfeed_max_articles).then(function (data) {
                    var pubs = data.data.esearchresult.idlist;
                    ctrl.recentPubs = [];
                    angular.forEach(pubs, function (value) {
                        euroPubData.getEuroPubData(value).then(function (data) {

                                if (data.data.resultList.result[0]) {
                                    ctrl.recentPubs.push(data.data.resultList.result[0]);
                                }
                            }
                        );

                    });
                });
            });

            ctrl.myInterval = 5000;
            ctrl.noWrapSlides = false;
            ctrl.active = 0;

            allOrgs.getAllOrgs(function(data) {
                ctrl.orgList = data;
            });

            // run the tutorial after clicking the button

            document.getElementById("get-started").onclick = function () {

                // set options for introjs
                var intro = introJs().setOption("skipLabel", "Skip Tutorial");
                intro.setOption("showStepNumbers", "false");
                intro.hideHints();

                // now start it
                intro.start();
            };

            // when the page is loaded, check whether or not to do the tutorial
            window.addEventListener('load', function () {
                if (localStorage.getItem('tutorial') != 'true') {

                    // set options for introjs
                    var intro = introJs().setOption("skipLabel", "Skip Tutorial");
                    intro.setOption("showStepNumbers", "false");
                    intro.hideHints();

                    // set a local variable to indicate the tutorial has been completed
                    intro.oncomplete(function () {
                        console.log("COMPLETED");
                        localStorage.setItem('tutorial', 'true');
                    });

                    // if the user stops the tutorial, treat it as completed
                    intro.onexit(function () {
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
        templateUrl: '/static/build/js/angular_templates/landing-page.min.html'
    });