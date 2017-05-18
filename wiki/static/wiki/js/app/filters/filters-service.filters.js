angular
    .module('filters')
    .filter('parseQID', function () {
        return function (input) {
            if (input) {
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
    .filter('taxid2Name', function () {
        var chlamMap = {
          '471472':'Chlamydia trachomatis 434/BU',
          '272561': 'Chlamydia trachomatis D/UW-3/CX',
          '243161': 'Chlamydia muridarum Str. Nigg',
          '115713': 'Chlamydia pneumoniae CWL209'
        };
        return function (input) {
            if (input) {
                return chlamMap[input]
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

                //var inList = input.split('/');
                //var qid = inList.slice(-1)[0];
                if (input === 'Q22809711') {
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
    .filter('list2CSV', function () {
        return function (input) {
            if(input){
              return input.join(", ");
            }
            else{
                return 'None'
            }

        }
    });

angular
    .module('filters')
    .filter('getJsonItem', function () {
        return function (ikey, ivalue, ijson) {
            var curGene;
            angular.forEach(ijson, function (value, key) {
                if (value[ikey].value == ivalue) {
                    curGene = value;
                }
                else {
                    return 'none'
                }
            });
            return curGene
        }
    });

angular
    .module('filters')
    .filter('getJsonItemNoWD', function () {
        return function (ikey, ivalue, ijson) {
            var curGene = [];
            angular.forEach(ijson, function (value, key) {
                if (value[ikey] == ivalue) {
                    curGene.push(value);
                }
                else {
                    return 'none'
                }
            });
            return curGene
        }
    });

angular
    .module('filters')
    .filter('deleteJsonItem', function () {
        return function (ikey, ivalue, ijson) {
            var goodGenes = [];
            angular.forEach(ijson, function (value, key) {
                if (value[ikey].value != ivalue) {
                }
                else {
                    goodGenes.push(value);
                }
            });
            return goodGenes
        }
    });

angular
    .module('filters')
    .filter('deleteJsonItemValuesList', function () {
        return function (ikey, ivalue, ijson) {
            var hits = [];
            angular.forEach(ivalue, function (tid) {
                angular.forEach(ijson, function (value, key) {
                    if (value[ikey].value == tid) {
                        hits.push(value);
                    }
                });
            });
            return hits
        }
    });


angular
    .module('filters')
    .filter('getJsonItemOrg', function () {
        return function (ikey, ivalue, ijson) {
            var curGene;
            angular.forEach(ijson, function (value, key) {
                if (value[ikey] == ivalue) {
                    curGene = value;
                }
                else {
                    return 'none'
                }
            });
            return curGene
        }
    });

angular
    .module('filters')
    .filter('orderObjectBy', function () {
        return function (input, attribute) {
            if (!angular.isObject(input)) return input;

            var array = [];
            for (var objectKey in input) {
                array.push(input[objectKey]);
            }

            array.sort(function (a, b) {
                a = parseInt(a[attribute].value);
                b = parseInt(b[attribute].value);
                return a - b;
            });
            return array;
        }
    });



angular
    .module('filters')
    .filter('keywordFilter', ['$filter', function ($filter) {
        return function (data, text) {
            var textArr = text.split(' ');
            angular.forEach(textArr, function (test) {
                if (test) {
                    data = $filter('filter')(data, test);
                }
            });
            return data;
        }
    }]);


angular
    .module('filters')
    .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    //Also remove . and , so its gives a cleaner result.
                    if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
                        lastspace = lastspace - 1;
                    }
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

angular
    .module('filters')
    .filter('typeFilter', function () {
        var types ={
            'Q7187' : 'gene',
            'Q20747295' : 'protein-coding-gene',
            'Q8054': 'protein'
        };
        return function (input) {
            return types[input]
        };
    });