angular
    .module('geneForm')
    .component('geneForm', {
        templateUrl: '/static/wiki/js/angular_templates/gene-form.html',
        bindings: {
            taxid: '<',
            genes: '<'
        },
        controller: function ($location) {
            var ctrl = this;
            
            ctrl.onSelect = function ($item) {
                $location.path('/organism/' + ctrl.taxid + "/gene/" + $item.locusTag.value);
            };
        }
    });
