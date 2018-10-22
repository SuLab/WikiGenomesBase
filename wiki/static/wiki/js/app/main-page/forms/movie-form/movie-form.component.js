angular
    .module('movieForm')
    .component('movieForm', {
        controller: function ($location, appData, $filter, sendToView) {
            'use strict';
            var ctrl = this;

            ctrl.$onInit = function () {

                ctrl.movieAnnotation = {
                    id: null,
                    qid: ctrl.gene.geneQID
                };

                // controls for navigating form
                ctrl.pageCount = 0;
                ctrl.nextClick = function () {
                    ctrl.pageCount += 1;
                };
                ctrl.backClick = function () {
                    ctrl.pageCount -= 1;
                };

                appData.getAppData(function (data) {
                    ctrl.appData = data;

                });

                // form validation, must be true to allow submission
                ctrl.validateId = function () {
                    if (ctrl.movieAnnotation.id) {
                        var match = ctrl.movieAnnotation.id.match(/[-_0-9A-Za-z]{11}/);
                        if (match) {
                            return match.length == 1;
                        }
                    }
                    return false;
                };

                // send form data to server to edit wikidata
                ctrl.sendData = function () {
                    ctrl.loading = true;

                    var success = true;
                    var authorize = false;

                    var url_suf = '/organism/' + ctrl.gene.taxid + '/gene/' + ctrl.gene.locusTag + '/wd_movie_edit';

                    console.log(url_suf);
                    sendToView.sendToView(url_suf, movieAnnotation).then(function (data) {
                        if (data.data.authentication === false) {
                            authorize = true;
                            success = false;
                        }
                        else if (!data.data.write_success) {
                            success = false;
                        }
                    }).finally(function () {
                        if (success) {
                            alert("Successfully Annotated! Well Done! The annotation will appear here in a few minutes.");
                            ctrl.resetForm();
                        } else if (authorize) {
                            console.log("FAILURE: AUTHENTICATION");
                            alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                        } else {
                            alert("Something went wrong.  Give it another shot!");
                        }

                        ctrl.loading = false;
                    });

                };
                ctrl.resetForm = function () {
                    ctrl.pageCount = 0;
                    ctrl.movieAnnotation.id = null;
                };

            };

        },
        templateUrl: '/static/build/js/angular_templates/movie-form.min.html',
        bindings: {
            gene: '<'
        }
    });
