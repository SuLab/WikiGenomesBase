angular
    .module('keywordForm')
    .component('keywordForm', {
        bindings: {
            data: '<'
        },
        controller: function ($filter, $location) {
            var ctrl = this;
            ctrl.$onInit = function(){
                ctrl.submitKeyword = function ($item) {
                    if ($item == undefined){
                        alert("Please enter a keyword or ID");
                    } else{
                        $location.path('keyword/' + $item);
                    }
                };
            };
        },
        templateUrl: '/static/wiki/js/angular_templates/keyword-form.html'
    });
