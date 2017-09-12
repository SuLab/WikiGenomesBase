angular
    .module('landingPage')
    .component('landingPage', {
        controller: function (allChlamOrgs, recentChlamPubLinks, euroPubData, appData) {
            var ctrl = this;
            ctrl.myInterval = 5000;
            ctrl.noWrapSlides = false;
            ctrl.active = 0;
            var currIndex = 0;
            appData.getAppData(function (data) {
                console.log("i'm trying");
                ctrl.appName = data[0].appName;
                console.log(ctrl.appName);

            });

            ctrl.orgList = allChlamOrgs.getAllOrgs();
            recentChlamPubLinks.getRecentChlamPubLinks().then(function (data) {
                var pubs = data.data.esearchresult.idlist;
                ctrl.recentPubs = [];
                angular.forEach(pubs, function (value) {
                    euroPubData.getEuroPubData(value).then(function (data) {

                            if(data.data.resultList.result[0]){
                                ctrl.recentPubs.push(data.data.resultList.result[0]);
                            }


                        }
                    )

                });
            });

        },
        templateUrl: '/static/wiki/js/app/landing-page/landing-page.html'
    });


