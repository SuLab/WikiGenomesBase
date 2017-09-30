angular
    .module('landingPage')
    .component('landingPage', {
        controller: function (allChlamOrgs, recentChlamPubLinks, euroPubData, appData, $scope) {
            var ctrl = this;
            ctrl.myInterval = 5000;
            ctrl.noWrapSlides = false;
            ctrl.active = 0;
            var currIndex = 0;

	    // set the app name
	    $scope.appName = "Chlambase.org";
	    
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

	    // when the page is loaded, check whether or not to do the tutorial
	    window.addEventListener('load', function() {
		if (localStorage.getItem('tutorial') != 'true') {

			// set options for introjs
	    		var intro = introJs().setOption("skipLabel", "Exit");
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
        templateUrl: '/static/wiki/js/app/landing-page/landing-page.html'
    });


