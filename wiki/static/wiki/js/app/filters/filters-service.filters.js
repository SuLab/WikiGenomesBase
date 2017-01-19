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

