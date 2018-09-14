angular.module("landingHeader").component("landingHeader", {
	templateUrl: "/static/build/js/angular_templates/landing-header.min.html",
	controller: function(appData) {
		var ctrl = this;
        appData.getAppData(function (data) {
            ctrl.appData = data;
        });
	},
	bindings: {
		"page": "<"
	}
});