angular
	.module("geneNameForm")
	.controller("geneNameCtrl",	function($location, sendToView) {
			'use strict';
			
			var ctrl = this;
			
			ctrl.pageCount = 0;
			
            ctrl.nextClick = function () {
                ctrl.pageCount += 1;
            };

            ctrl.backClick = function () {
                ctrl.pageCount -= 1;
            };
			
			ctrl.geneNameData = {
					geneQID: "",
					proteinQID: "",
					geneName: ""
			};
			
			ctrl.$onChanges = function() {
				ctrl.geneNameData.geneQID = ctrl.gene.geneQID;
				ctrl.geneNameData.proteinQID = ctrl.gene.proteinQID;
			};
			
            ctrl.sendData = function (formData) {
            	
                var url_suf = $location.path().replace("/authorized/", "") + '/wd_gene_name_edit';
                
                	sendToView.sendToView(url_suf, formData).then(function (data) {
                        if (data.data.write_success === true) {
                        	console.log("SUCCESS");
                            console.log(data);
                            alert("Successfully Annotated! Well Done! The annotation will appear here in a few minutes.");
                            ctrl.geneNameData.geneName = "";
                        } else if (data.data.authentication === false){
                            console.log("FAILURE: AUTHENTICATION");
                        	console.log(data);
                            alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                        }
                        else {
                        	console.log("FAILURE: UNKNOWN");
                            console.log(data);
                            alert("Something went wrong.  Give it another shot!");
                        }
                    });
                
            };

	})
	.component("geneNameForm", {
		bindings: {
			gene: "<"
		},
		templateUrl: "/static/wiki/js/angular_templates/gene-name-form.html",
		controller : "geneNameCtrl"
	});