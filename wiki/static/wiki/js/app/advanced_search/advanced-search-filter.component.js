angular
    .module('advancedSearchFilter')
    .component('advancedSearchFilter', {
        controller: function ($cacheFactory, allGoTerms, allChlamOrgs) {
            var ctrl = this;

            var cache = $cacheFactory.get("advSearch");
            if (cache) {
                ctrl.mf = cache.get("mf")[0];
                ctrl.mf_text = cache.get("mf")[1];
                ctrl.bp = cache.get("bp")[0];
                ctrl.bp_text = cache.get("bp")[1];
                ctrl.cc = cache.get("cc")[0];
                ctrl.cc_text = cache.get("cc")[1];
                ctrl.hp = cache.get("hp")[0];
                ctrl.hp_text = cache.get("hp")[1];
                ctrl.entrez = cache.get("entrez")[0];
                ctrl.entrez_text = cache.get("entrez")[1];
                ctrl.uniprot = cache.get("uniprot")[0];
                ctrl.uniprot_text = cache.get("uniprot")[1];
                ctrl.refseq = cache.get("refseq")[0];
                ctrl.refseq_text = cache.get("refseq")[1];
                ctrl.pdb = cache.get("pdb")[0];
                ctrl.pdb_text = cache.get("pdb")[1];
                ctrl.cm = cache.get("cm");
                ctrl.tm = cache.get("tm");
                ctrl.im = cache.get("im");
                ctrl.rm = cache.get("rm");
                ctrl.rb = cache.get("rb");
                ctrl.eb = cache.get("eb");
                ctrl.bacp = cache.get("bacp")[0];
                ctrl.bacp_text = cache.get("bacp")[1];
                ctrl.orgData = cache.get("orgs");
                ctrl.constitutive = cache.get("constitutive");
                ctrl.early = cache.get("early");
                ctrl.mid = cache.get("mid");
                ctrl.mid_late = cache.get("mid_late");
                ctrl.late = cache.get("late");
                ctrl.very_late = cache.get("very_late");

            } else {
                ctrl.orgData = [];
                allChlamOrgs.getAllOrgs(function (data) {
                    angular.forEach(data, function (value) {
                        value.check = true;
                        ctrl.orgData.push(value);
                    });
                });
            }

            var goClassMap = {
                'mf_button': {
                    name: 'Molecular Function',
                    QID: 'Q14860489'
                },
                'cc_button': {
                    name: 'Cellular Component',
                    QID: 'Q5058355'
                },
                'bp_button': {
                    name: 'Biological Process',
                    QID: 'Q2996394'
                }
            };

            ctrl.mfTerms = function (val) {
                return allGoTerms.getGoTermsAll(val, goClassMap.mf_button.QID).then(function (data) {
                    return data.data.results.bindings.map(function (item) {
                        return item;
                    });
                });
            };

            ctrl.ccTerms = function (val) {
                return allGoTerms.getGoTermsAll(val, goClassMap.cc_button.QID).then(function (data) {
                    return data.data.results.bindings.map(function (item) {
                        return item;
                    });
                });
            };

            ctrl.bpTerms = function (val) {
                return allGoTerms.getGoTermsAll(val, goClassMap.bp_button.QID).then(function (data) {
                    return data.data.results.bindings.map(function (item) {
                        return item;
                    });
                });
            };

            ctrl.storeCache = function() {
                var cache = $cacheFactory.get("advSearch");
                if(cache == undefined) {
                    cache = $cacheFactory('advSearch');
                }
                cache.put("mf", [ctrl.mf, ctrl.mf_text]);
                cache.put("bp", [ctrl.bp, ctrl.bp_text]);
                cache.put("cc", [ctrl.cc, ctrl.cc_text]);
                cache.put("hp", [ctrl.hp, ctrl.hp_text]);
                cache.put("entrez", [ctrl.entrez, ctrl.entrez_text]);
                cache.put("uniprot", [ctrl.uniprot, ctrl.uniprot_text]);
                cache.put("refseq", [ctrl.refseq, ctrl.refseq_text]);
                cache.put("pdb", [ctrl.pdb, ctrl.pdb_text]);
                cache.put("cm", ctrl.cm);
                cache.put("tm", ctrl.tm);
                cache.put("im", ctrl.im);
                cache.put("rm", ctrl.rm);
                cache.put("rb", ctrl.rb);
                cache.put("eb", ctrl.eb);
                cache.put("bacp", [ctrl.bacp, ctrl.bacp_text]);
                cache.put("constitutive", ctrl.constitutive);
                cache.put("early", ctrl.early);
                cache.put("mid", ctrl.mid);
                cache.put("mid_late", ctrl.mid_late);
                cache.put("late", ctrl.late);
                cache.put("very_late", ctrl.very_late);
                cache.put("orgs", ctrl.orgData);
            };

        },
        templateUrl: '/static/build/js/angular_templates/advanced-search-filter.min.html'
    });