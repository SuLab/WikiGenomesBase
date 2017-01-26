angular
    .module('filters')
    .filter('parseQID', function () {
        return function (input) {
            var inList = input.split('/');
            return inList.slice(-1)[0];
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
    .filter('convertStrand', function () {
        return function (input) {
            var inList = input.split('/');
            var qid = inList.slice(-1)[0];
            if (qid === 'Q22809711') {
                return 'reverse'
            }
            else {
                return 'forward'
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