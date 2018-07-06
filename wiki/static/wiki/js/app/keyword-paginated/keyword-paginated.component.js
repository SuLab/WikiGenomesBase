angular
    .module('keywordPaginated')
    .component('keywordPaginated', {
        bindings: {
            data: '<',
            orgs: '<'
        },
        controller: function ($location) {
            'use strict';
            var ctrl = this;
            ctrl.onSelect = function ($item) {
                    $location.path('/organism/' + $item.taxid.value + "/gene/" + $item.locusTag.value);
                };
            ctrl.longTitle = function($item){
                if($item.length > 80){
                    return $item;
                }else{
                    return '';
                }
            };
        },
        templateUrl: '/static/build/js/angular_templates/keyword-paginated.min.html'

    });