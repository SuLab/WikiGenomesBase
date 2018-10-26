angular.module("landingHeader").component("landingHeader", {
	templateUrl: "/static/build/js/angular_templates/landing-header.min.html",
	controller: function(appData, $location) {
		var ctrl = this;
        appData.getAppData(function (data) {
            ctrl.appData = data;
        });

        ctrl.beta = $location.url().includes("dev");
	},
	bindings: {
		"page": "<"
	}
});