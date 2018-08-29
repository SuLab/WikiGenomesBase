angular
    .module('advancedSearchFilter')
    .component('advancedSearchFilter', {
        controller: function ($cacheFactory, allGoTerms, allOrgs) {
            var ctrl = this;

            var cache = $cacheFactory.get("advSearch");
            if (cache) {
                ctrl.mf = cache.get("mf")[0];
                ctrl.mftext = cache.get("mf")[1];
                ctrl.bp = cache.get("bp")[0];
                ctrl.bptext = cache.get("bp")[1];
                ctrl.cc = cache.get("cc")[0];
                ctrl.cctext = cache.get("cc")[1];
                ctrl.hp = cache.get("hp")[0];
                ctrl.hptext = cache.get("hp")[1];
                ctrl.entrez = cache.get("entrez")[0];
                ctrl.entreztext = cache.get("entrez")[1];
                ctrl.uniprot = cache.get("uniprot")[0];
                ctrl.uniprottext = cache.get("uniprot")[1];
                ctrl.refseq = cache.get("refseq")[0];
                ctrl.refseqtext = cache.get("refseq")[1];
                ctrl.pdb = cache.get("pdb")[0];
                ctrl.pdbtext = cache.get("pdb")[1];
                ctrl.cm = cache.get("cm");
                ctrl.tm = cache.get("tm");
                ctrl.im = cache.get("im");
                ctrl.rm = cache.get("rm");
                ctrl.rb = cache.get("rb");
                ctrl.eb = cache.get("eb");
                ctrl.bacp = cache.get("bacp")[0];
                ctrl.bacptext = cache.get("bacp")[1];
                ctrl.orgData = cache.get("orgs");
                ctrl.constitutive = cache.get("constitutive");
                ctrl.early = cache.get("early");
                ctrl.mid = cache.get("mid");
                ctrl.midlate = cache.get("midlate");
                ctrl.late = cache.get("late");
                ctrl.verylate = cache.get("verylate");

            } else {
                ctrl.orgData = [];
                allOrgs.getAllOrgs(function (data) {
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
                cache.put("mf", [ctrl.mf, ctrl.mftext]);
                cache.put("bp", [ctrl.bp, ctrl.bptext]);
                cache.put("cc", [ctrl.cc, ctrl.cctext]);
                cache.put("hp", [ctrl.hp, ctrl.hptext]);
                cache.put("entrez", [ctrl.entrez, ctrl.entreztext]);
                cache.put("uniprot", [ctrl.uniprot, ctrl.uniprottext]);
                cache.put("refseq", [ctrl.refseq, ctrl.refseqtext]);
                cache.put("pdb", [ctrl.pdb, ctrl.pdbtext]);
                cache.put("cm", ctrl.cm);
                cache.put("tm", ctrl.tm);
                cache.put("im", ctrl.im);
                cache.put("rm", ctrl.rm);
                cache.put("rb", ctrl.rb);
                cache.put("eb", ctrl.eb);
                cache.put("bacp", [ctrl.bacp, ctrl.bacptext]);
                cache.put("constitutive", ctrl.constitutive);
                cache.put("early", ctrl.early);
                cache.put("mid", ctrl.mid);
                cache.put("midlate", ctrl.midlate);
                cache.put("late", ctrl.late);
                cache.put("verylate", ctrl.verylate);
                cache.put("orgs", ctrl.orgData);
            };

        },
        templateUrl: '/static/build/js/angular_templates/advanced-search-filter.min.html',
        bindings: {
            mf: "=?",
            mftext: "=?",
            bp: "=?",
            bptext: "=?",
            cc: "=?",
            cctext: "=?",
            hp: "=?",
            hptext: "=?",
            entrez: "=?",
            entreztext: "=?",
            uniprot: "=?",
            uniprottext: "=?",
            refseq: "=?",
            refseqtext: "=?",
            pdb: "=?",
            pdbtext: "=?",
            bacp: "=?",
            bacptext: "=?",
            cm: "=?",
            tm: "=?",
            im: "=?",
            rm: "=?",
            rb: "=?",
            eb: "=?",
            constitutive: "=?",
            early: "=?",
            mid: "=?",
            midlate: "=?",
            late: "=?",
            verylate: "=?",
            orgData: "=?",
            storeCache: "=?"
        }
    });