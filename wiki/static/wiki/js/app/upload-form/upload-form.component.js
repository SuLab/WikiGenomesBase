angular
    .module('uploadForm')
    .component('uploadForm', {
        bindings: {
            data: '<'
        },
        controller: function ($routeParams) {
            var ctrl = this;
            console.log($routeParams);
        },
        template: '<div class="overlay"><div class="loading-img"></div></div>'
    });




