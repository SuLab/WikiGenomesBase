angular
    .module('keywordForm')
    .component('keywordForm', {
        bindings: {
            taxid: '<',
            genes: '<'
        },
        controller: function ($filter, $location) {
            'use strict';
            var ctrl = this;
            ctrl.$onInit = function(){
                ctrl.submitKeyword = function ($item) {
                    if ($item == undefined){
                        alert("Please enter a keyword or ID");
                    } else{
                        $location.path('keyword/' + $item);
                    }
                };
                
                ctrl.onSelect = function ($item) {
                    $location.path('/organism/' + ctrl.taxid + "/gene/" + $item.locusTag.value);
                };
            };
        },
        templateUrl: '/static/wiki/js/angular_templates/keyword-form.html'
    });
