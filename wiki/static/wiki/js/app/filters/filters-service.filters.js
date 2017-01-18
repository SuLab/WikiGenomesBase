angular
    .module('filters')
    .filter('parseQID', function () {
        return function (input) {
            console.log(input);
            var inList = input.split('/');
            return inList.slice(-1)[0];
        };
    });


