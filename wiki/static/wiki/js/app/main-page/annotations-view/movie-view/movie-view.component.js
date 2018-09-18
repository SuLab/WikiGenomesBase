angular
    .module('movieView')
    .component('movieView', {
        templateUrl: '/static/build/js/angular_templates/movie-view.min.html',
        controller: function () {
            'use strict';
            var ctrl = this;

            ctrl.$onChanges = function() {
                ctrl.uris = [ctrl.uri];
                console.log(ctrl.uri);
            };

        },
        bindings: {
            uri: '<'
        }
    });
