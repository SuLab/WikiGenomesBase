angular
    .module('filters')
    .filter('parseQID', function () {
        return function (input) {
            if (input){
            var inList = input.split('/');
            return inList.slice(-1)[0];
            }
            else {
                return "None"
            }
        };
    });

angular
    .module('filters')
    .filter('replaceColon', function () {
        return function (input) {
            var inList = input.split(':');
            return inList.join('_');
        };
    });

angular
    .module('filters')
    .filter('replaceColon', function () {
        return function (input) {
            var inList = input.split(':');
            return inList.join('_');
        };
    });

angular
    .module('filters')
    .filter('replaceperiod', function () {
        return function (input) {
            var inList = input.split('.');
            return inList.join('_');
        };
    });

angular
    .module('filters')
    .filter('convertStrand', function () {
        return function (input) {
            if (input) {

            var inList = input.split('/');
            var qid = inList.slice(-1)[0];
            if (qid === 'Q22809711') {
                return 'reverse'
            }
            else {
                return 'forward'
            }
        }
        else {
                return 'None'
            }
        };
    });

angular
    .module('filters')
    .filter('uniqueGoTerms', function () {
        // we will return a function which will take in a collection
        // and a keyname
        return function (input) {
            var newList = [];
            angular.forEach(input, function (oldItem) {
                angular.forEach(newList, function (newItem) {
                    if (oldItem != newItem) {
                        newList.push(newItem);
                    }
                });
            });
            return newList
        };
    });


angular
    .module('filters')
    .filter('goClass', function () {
        // we will return a function which will take in a collection
        // and a keyname
        var goclasses = {
            'mf_button': "Molecular Function",
            'cc_button': "Cellular Component",
            'bp_button': "Biological Process"

        };

        return function (input) {
            return goclasses[input]
        };

    });

angular
    .module('filters')
    .filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

angular
    .module('filters')
    .filter('getJsonItem', function () {
    return function (ikey, ivalue, ijson) {
        var curGene;
        angular.forEach(ijson, function(value, key){
            if (value[ikey].value == ivalue){
                curGene = value;
            }
            else {
                return 'none'
            }
        });
        return curGene
    }
});


