angular
    .module('movieView')
    .component('movieView', {
        templateUrl: '/static/build/js/angular_templates/movie-view.min.html',
        controller: function ($location) {
            'use strict';
            var ctrl = this;

            ctrl.checkAuthorization = function(modal) {

                if (!$location.path().includes("authorized")) {
                    alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                } else {
                    $("#" + modal).modal('show');
                }
            };

        },
        bindings: {
            data: '<',
            gene: '<'
        }
    });
