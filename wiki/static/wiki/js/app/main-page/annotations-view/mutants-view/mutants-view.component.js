angular
    .module('mutantsView')
    .component('mutantsView', {
        bindings : {
            data : '<'
        },
        controller : function($location, sendToView, $filter) {
            'use strict';
            var ctrl = this;

            ctrl.checkAuthorization = function(modal) {
                if (!$location.path().includes("authorized")) {
                    alert('Please authorize ChlamBase to edit Wikidata on your behalf!');
                } else {
                    $("#" + modal).modal('show');
                }
            };

            ctrl.$onInit = function() {

            };
            
            ctrl.authorized = $location.path().includes("authorized");
            
            ctrl.deleteAnnotation = function(mutant) {
                console.log(mutant);
                ctrl.loading = true;
                mutant.action = 'delete';
                var url_suf = $location.path() + '/wd_mutant_edit';
                sendToView.sendToView(url_suf, mutant).then(function(data) {}).finally(function() {
                    ctrl.loading = false;
                });
            };

            ctrl.$onChanges = function() {
                /* Uncomment to do local testing with sample data
                ctrl.data = [{ "_id" : "CTL2M007_(CT229_null)-CTL0441-530488", "mutation_id" : "EFO_0000370", "aa_effect" : "D291N", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.640Z", "snv_name" : "silent_mutation", "snv_id" : "SO:0001017", "locusTag" : "CTL0441", "coordinate" : { "end" : "530488", "start" : "530488" }, "taxid" : "471472", "doi" : null, "variant_base" : "T", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M007_(CT229_null)-CTL0481-574526", "mutation_id" : "EFO_0000370", "aa_effect" : "Q31*", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "G", "date" : "2018-07-12T17:18:11.669Z", "snv_name" : "stop_gained", "snv_id" : "SO:0001587", "locusTag" : "CTL0481", "coordinate" : { "end" : "574526", "start" : "574526" }, "taxid" : "471472", "doi" : null, "variant_base" : "A", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M007_(CT229_null)-CTL0486-579923", "mutation_id" : "EFO_0000370", "aa_effect" : "", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "G", "date" : "2018-07-12T17:18:11.679Z", "snv_name" : "synonymous", "snv_id" : "SO:0001815", "locusTag" : "CTL0486", "coordinate" : { "end" : "579923", "start" : "579923" }, "taxid" : "471472", "doi" : null, "variant_base" : "A", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M007_(CT229_null)-CTL0535-633677", "mutation_id" : "EFO_0000370", "aa_effect" : "P49S", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "G", "date" : "2018-07-12T17:18:11.684Z", "snv_name" : "non-synonymous", "snv_id" : "SO:0001816", "locusTag" : "CTL0535", "coordinate" : { "end" : "633677", "start" : "633677" }, "taxid" : "471472", "doi" : null, "variant_base" : "A", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M007_(CT229_null)-CTL0574-680577", "mutation_id" : "EFO_0000370", "aa_effect" : "P353S", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "G", "date" : "2018-07-12T17:18:11.776Z", "snv_name" : "non-synonymous", "snv_id" : "SO:0001816", "locusTag" : "CTL0574", "coordinate" : { "end" : "680577", "start" : "680577" }, "taxid" : "471472", "doi" : null, "variant_base" : "A", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M007_(CT229_null)-CTL0590-701608", "mutation_id" : "EFO_0000370", "aa_effect" : "R551H", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.792Z", "snv_name" : "silent_mutation", "snv_id" : "SO:0001017", "locusTag" : "CTL0590", "coordinate" : { "end" : "701608", "start" : "701608" }, "taxid" : "471472", "doi" : null, "variant_base" : "T", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M007_(CT229_null)-CTL0670-794606", "mutation_id" : "EFO_0000370", "aa_effect" : "", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.807Z", "snv_name" : "synonymous", "snv_id" : "SO:0001815", "locusTag" : "CTL0670", "coordinate" : { "end" : "794606", "start" : "794606" }, "taxid" : "471472", "doi" : null, "variant_base" : "T", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M007_(CT229_null)-CTL0470-566172", "mutation_id" : "EFO_0000370", "aa_effect" : "", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "G", "date" : "2018-07-12T17:18:11.655Z", "snv_name" : "synonymous", "snv_id" : "SO:0001815", "locusTag" : "CTL0470", "coordinate" : { "end" : "566172", "start" : "566172" }, "taxid" : "471472", "doi" : null, "variant_base" : "A", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M007_(CT229_null)-CTL0707-836098", "mutation_id" : "EFO_0000370", "aa_effect" : "E532K", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.817Z", "snv_name" : "non-synonymous", "snv_id" : "SO:0001816", "locusTag" : "CTL0707", "coordinate" : { "end" : "836098", "start" : "836098" }, "taxid" : "471472", "doi" : null, "variant_base" : "T", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M007_(CT229_null)-CTL0729-862642", "mutation_id" : "EFO_0000370", "aa_effect" : "D13N", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "G", "date" : "2018-07-12T17:18:11.823Z", "snv_name" : "non-synonymous", "snv_id" : "SO:0001816", "locusTag" : "CTL0729", "coordinate" : { "end" : "862642", "start" : "862642" }, "taxid" : "471472", "doi" : null, "variant_base" : "A", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M007_(CT229_null)-CTL0859-994816", "mutation_id" : "EFO_0000370", "aa_effect" : "G159R", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.873Z", "snv_name" : "non-synonymous", "snv_id" : "SO:0001816", "locusTag" : "CTL0859", "coordinate" : { "end" : "994816", "start" : "994816" }, "taxid" : "471472", "doi" : null, "variant_base" : "T", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M007_(CT229_null)-CTL0879-1014167", "mutation_id" : "EFO_0000370", "aa_effect" : "D50N", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.888Z", "snv_name" : "silent_mutation", "snv_id" : "SO:0001017", "locusTag" : "CTL0879", "coordinate" : { "end" : "1014167", "start" : "1014167" }, "taxid" : "471472", "doi" : null, "variant_base" : "T", "pub" : "25920978", "name" : "CTL2M007 (CT229 null)" },
                { "_id" : "CTL2M021_(SPQ52-6-HC)--677265", "mutation_id" : "EFO_0000370", "aa_effect" : "", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.902Z", "snv_name" : "non_transcribed_region", "snv_id" : "SO:0000183", "locusTag" : "", "coordinate" : { "end" : "677265", "start" : "677265" }, "taxid" : "471472", "doi" : null, "variant_base" : "A", "pub" : "25920978", "name" : "CTL2M021 (SPQ52-6-HC)" },
                { "_id" : "CTL2M021_(SPQ52-6-HC)-CTL0050-58993", "mutation_id" : "EFO_0000370", "aa_effect" : "A277T", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.905Z", "snv_name" : "non-synonymous", "snv_id" : "SO:0001816", "locusTag" : "CTL0050", "coordinate" : { "end" : "58993", "start" : "58993" }, "taxid" : "471472", "doi" : null, "variant_base" : "T", "pub" : "25920978", "name" : "CTL2M021 (SPQ52-6-HC)" },
                { "_id" : "CTL2M021_(SPQ52-6-HC)-CTL0290-363302", "mutation_id" : "EFO_0000370", "aa_effect" : "S235N", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "G", "date" : "2018-07-12T17:18:11.908Z", "snv_name" : "silent_mutation", "snv_id" : "SO:0001017", "locusTag" : "CTL0290", "coordinate" : { "end" : "363302", "start" : "363302" }, "taxid" : "471472", "doi" : null, "variant_base" : "A", "pub" : "25920978", "name" : "CTL2M021 (SPQ52-6-HC)" },
                { "_id" : "CTL2M021_(SPQ52-6-HC)-CTL0716-850690", "mutation_id" : "EFO_0000370", "aa_effect" : "", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.911Z", "snv_name" : "synonymous", "snv_id" : "SO:0001815", "locusTag" : "CTL0716", "coordinate" : { "end" : "850690", "start" : "850690" }, "taxid" : "471472", "doi" : null, "variant_base" : "T", "pub" : "25920978", "name" : "CTL2M021 (SPQ52-6-HC)" },
                { "_id" : "CTL2M021_(SPQ52-6-HC)--941659", "mutation_id" : "EFO_0000370", "aa_effect" : "", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.926Z", "snv_name" : "non_transcribed_region", "snv_id" : "SO:0000183", "locusTag" : "", "coordinate" : { "end" : "941659", "start" : "941659" }, "taxid" : "471472", "doi" : null, "variant_base" : "T", "pub" : "25920978", "name" : "CTL2M021 (SPQ52-6-HC)" },
                { "_id" : "CTL2M021_(SPQ52-6-HC)-CTL0064-78227", "mutation_id" : "EFO_0000370", "aa_effect" : "P343S", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.940Z", "snv_name" : "silent_mutation", "snv_id" : "SO:0001017", "locusTag" : "CTL0064", "coordinate" : { "end" : "78227", "start" : "78227" }, "taxid" : "471472", "doi" : null, "variant_base" : "T", "pub" : "25920978", "name" : "CTL2M021 (SPQ52-6-HC)" },
                { "_id" : "CTL2M021_(SPQ52-6-HC)-CTL0165-213478", "mutation_id" : "EFO_0000370", "aa_effect" : "D230N", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "C", "date" : "2018-07-12T17:18:11.949Z", "snv_name" : "silent_mutation", "snv_id" : "SO:0001017", "locusTag" : "CTL0165", "coordinate" : { "end" : "213478", "start" : "213478" }, "taxid" : "471472", "doi" : null, "variant_base" : "T", "pub" : "25920978", "name" : "CTL2M021 (SPQ52-6-HC)" },
                { "_id" : "CTL2M021_(SPQ52-6-HC)-CTL0295-366191", "mutation_id" : "EFO_0000370", "aa_effect" : "G43R", "chromosome" : "NC_010287.1", "mutation_name" : "chemically induced mutation", "ref_base" : "G", "date" : "2018-07-12T17:18:11.954Z", "snv_name" : "non-synonymous", "snv_id" : "SO:0001816", "locusTag" : "CTL0295", "coordinate" : { "end" : "366191", "start" : "366191" }, "taxid" : "471472", "doi" : null, "variant_base" : "A", "pub" : "25920978", "name" : "CTL2M021 (SPQ52-6-HC)" }
                ];
                */
                if (ctrl.data) {
                	var parsed = [];
                	angular.forEach(ctrl.data, function(mutant) {
                		var next = mutant;
                		next.start = parseInt(mutant.coordinate.start);
                		next.end = parseInt(mutant.coordinate.end);
                		parsed.push(next);
                	});

	                ctrl.chemParams = $filter('filter')(parsed, "EFO_0000370");
	                ctrl.transParams = $filter('filter')(parsed, "EFO_0004021");
	                ctrl.intronParams = $filter('filter')(parsed, "EFO_0004016");
	                ctrl.recombParams = $filter('filter')(parsed, "EFO_0004293");
                }
            };

        },
        templateUrl : '/static/build/js/angular_templates/mutants-view.min.html'
    });