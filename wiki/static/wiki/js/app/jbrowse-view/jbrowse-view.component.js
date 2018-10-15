angular
    .module('jbrowseView')
    .component('jbrowseView', {
        template : '<iframe class="jbrowse" ng-src={{$ctrl.jbrowseURI()}}></iframe>',
        bindings : {
            start: '<',
            end: '<',
            refseq: '<',
            highlight: '<?',
            delay: '<?',
            load: '=?'
        },
        controller : function($routeParams) {

            var ctrl = this;
            ctrl.taxid = $routeParams.taxid;
            ctrl.$onInit = function() {};

            // if a load was scheduled but data not fully loaded
            ctrl.queued = false;

            ctrl.$onChanges = function() {
                if (!ctrl.delay || ctrl.queued) {
                    ctrl.load();
                }
            };

            ctrl.load = function() {
                if (ctrl.start && ctrl.end && ctrl.refseq != undefined) {
                    ctrl.queued = false;
                    ctrl.jbrowseURI = function() {
                        var start = ctrl.start;
                        if (ctrl.start - 1000 >= 0) {
                            start = Number(ctrl.start) - 1000;
                        }
                        var end = Number(ctrl.end) + 1000;

                        var loc = "";
                        var highlight = "";
                        if (start && end && ctrl.refseq) {
                            loc = "&loc=" + ctrl.refseq + ":" + start + '..' + end;
                            if (ctrl.highlight) {
                                highlight = "&highlight=" + ctrl.refseq + ":" + ctrl.start + '..' + ctrl.end;
                            }
                        }

                        return "static/wiki/js/external_js/JBrowse-1.14.1/index.html?data=" + ctrl.taxid +
                            "_data&tracks=DNA,genes,operons,mutants&menu=0" + loc + highlight;
                    };

                } else {
                    ctrl.queued = true;
                }

            };
        }
    });