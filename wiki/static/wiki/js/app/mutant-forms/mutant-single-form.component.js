angular
    .module('mutantForm')
    .component('mutantForm', {
        bindings: {
            data: '<'
        },

        controller: function (pubMedData, $filter, $location, $routeParams, locusTag2QID, wdGetEntities, sendToView) {
            var ctrl = this;
            ctrl.$onInit = function () {

                ctrl.mutantAnnotation = {
                    taxid: $routeParams.taxid,
                    locusTag: $routeParams.locusTag,
                    chromosome: null,
                    name: null,
                    mutant_type: {
                        "alias": null,
                        "name": null,
                        "id": null,
                        "key": null
                    },
                    coordinate: {
                        start: null
                    },
                    percent_gene_intact: null,
                    insert_direction: null,
                    pub: null,
                    ref_base: null,
                    variant_base: null,
                    variant_type: {alias: null, name: null, id: null},
                    aa_effect: null
                };
                ctrl.pageCount = 0;
                ctrl.alerts = {
                    'success': false,
                    'error': false
                };
                locusTag2QID.getLocusTag2QID(ctrl.mutantAnnotation.locusTag, ctrl.mutantAnnotation.taxid).then(function (data) {
                    var results = data.data.results.bindings;
                    if (results.length > 0) {
                        ctrl.geneQID = $filter('parseQID')(results[0].gene.value);
                    }

                }).finally(function () {
                    wdGetEntities.wdGetEntities(ctrl.geneQID).then(function (data) {
                        var entity = data.entities[ctrl.geneQID];
                        ctrl.entrez = entity.claims.P351[0].mainsnak.datavalue.value;
                        ctrl.geneLabel = entity.labels.en.value;
                        ctrl.geneDescription = entity.descriptions.en.value;
                        ctrl.genStart = entity.claims.P644[0].mainsnak.datavalue.value;
                        ctrl.genEnd = entity.claims.P645[0].mainsnak.datavalue.value;
                        ctrl.strand = entity.claims.P2548[0].mainsnak.datavalue.value;
                        //ctrl.mutantAnnotation.chromosome = entity.claims.P644[0].qualifiers.P2249[0].datavalue.value;
                        ctrl.mutantAnnotation.chromosome = entity.claims.P644[0].qualifiers.P1057[0].datavalue.value;
                    });
                });

                //controls for navigating form
                ctrl.nextClick = function () {
                    ctrl.pageCount += 1;
                };
                ctrl.backClick = function () {
                    ctrl.pageCount -= 1;
                };

                ctrl.seq_ontology_map = [
                    {
                        alias: 'SYNONYMOUS',
                        name: 'synonymous',
                        id: 'SO:0001814'
                    },
                    {
                        alias: 'Non-neutral',
                        name: 'non-synonymous',
                        id: 'SO:0001816'
                    },
                    {
                        alias: 'NON-CODING',
                        name: 'non_transcribed_region',
                        id: 'SO:0000183'
                    },
                    {
                        alias: 'Neutral',
                        name: 'silent_mutation',
                        id: 'SO:0001017'
                    },
                    {
                        alias: 'NONSENSE',
                        name: 'stop_gained',
                        id: 'SO:0001017'
                    }

                ];

                ctrl.mutant_type_map = [
                    {
                        alias: 'chemical mutagenesis',
                        name: 'chemically induced mutation',
                        id: 'EFO_0000370',
                        key: 1
                    },
                    {
                        alias: 'transposon mutagenesis',
                        name: 'tbd',
                        id: 'tbd',
                        key: 2
                    }
                ];


                ctrl.getPMID = function (val) {
                    return pubMedData.getPMID(val).then(
                        function (data) {

                            var resultData = [data.data.result[val]];
                            return resultData.map(function (item) {
                                return item;
                            });
                        }
                    );
                };

                ctrl.selectPub = function ($item, $model, $label) {
                    ctrl.mutantAnnotation.pub = $item;
                    ctrl.pubValue = ''
                };

                ctrl.resetForm = function () {
                    ctrl.$onInit();
                };

                //send form data to server to edit wikidata
                ctrl.sendData = function (formData) {
                    ctrl.loading = true;
                    formData.action = 'annotate';
                    var url_suf = $location.path() + '/wd_mutant_edit';
                    console.log(url_suf);
                    sendToView.sendToView(url_suf, formData).then(function (data) {
                        if (data.data.write_success === true) {
                            ctrl.alerts.success = true;
                        }
                        else {
                            ctrl.alerts.error = true;
                        }
                    }).finally(function () {
                        ctrl.loading = false;
                    });

                };
            };

        },
        templateUrl: '/static/wiki/js/angular_templates/mutant-form.html'
    });
