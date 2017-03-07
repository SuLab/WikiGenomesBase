angular
    .module('landingPage')
    .component('landingPage', {
        controller: function (allChlamOrgs, recentChlamPubLinks, euroPubData) {
            var ctrl = this;
            ctrl.myInterval = 5000;
            ctrl.noWrapSlides = false;
            ctrl.active = 0;
            var currIndex = 0;
            ctrl.orgList = allChlamOrgs.getAllOrgs();
            recentChlamPubLinks.getRecentChlamPubLinks().then(function (data) {
                console.log(data);
                var pubs = data.data.esearchresult.idlist;
                ctrl.recentPubs = [];
                angular.forEach(pubs, function (value) {
                    euroPubData.getEuroPubData(value).then(function (data) {
                            ctrl.recentPubs.push(data.data.resultList.result[0]);
                        }
                    )

                })
            });

        },
        templateUrl: '/static/wiki/js/angular_templates/landing-page.html'
    });


