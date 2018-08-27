angular.module("header").component("header", {
	templateUrl: "/static/build/js/angular_templates/header.min.html",
	controller: function(appData) {
		var ctrl = this;
        appData.getAppData(function (data) {
            ctrl.appData = data;
        });
	},
	bindings: {
		oauth: "<"
	}
});