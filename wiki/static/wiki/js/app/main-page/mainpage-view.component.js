angular.module("mainPage").component("mainPage",{controller:function(e,n,t,a,r,o,u,i,s,c,l,g,p,m,d,v,h,f){var G=this;G.$onInit=function(){G.currentTaxid=n.taxid,G.currentLocusTag=n.locusTag,G.currentGene={locusTag:G.currentLocusTag,taxid:G.currentTaxid},G.annotations={ecnumber:[]},a.getAllOrgs(function(n){G.orgList=n,G.currentOrg=e("getJsonItemOrg")("taxid",G.currentTaxid,G.orgList),void 0==G.currentOrg&&(alert("not a valid taxonomy id"),t.path("/"))}),h.getAppData(function(e){G.appName=e[0].appName}),p.getLocusTag2QID(G.currentLocusTag,G.currentTaxid).then(function(n){var a=n.data.results.bindings;a.length>0?(G.currentGene.geneQID=e("parseQID")(a[0].gene.value),G.currentGene.proteinQID=e("parseQID")(a[0].protein.value)):(alert(G.currentLocusTag+" doesn't seem to be a gene in this genome."),t.path("/organism/"+G.currentTaxid))}).finally(function(){r.wdGetEntities(G.currentGene.geneQID).then(function(e){var n=e.entities[G.currentGene.geneQID];G.currentGene.entrez=n.claims.P351[0].mainsnak.datavalue.value,G.currentGene.geneLabel=n.labels.en.value,G.currentGene.locusTag=n.claims.P2393[0].mainsnak.datavalue.value,G.currentGene.geneDescription=n.descriptions.en.value,G.currentGene.genStart=n.claims.P644[0].mainsnak.datavalue.value,G.currentGene.genEnd=n.claims.P645[0].mainsnak.datavalue.value,G.currentGene.strand=n.claims.P2548[0].mainsnak.datavalue.value,G.currentGene.geneType=n.claims.P279[0].mainsnak.datavalue.value,G.currentGene.geneAliases=[],angular.forEach(n.aliases.en,function(e){e.value!=G.currentGene.locusTag&&G.currentGene.geneAliases.push(e.value)})}),r.wdGetEntities(G.currentGene.proteinQID).then(function(n){var t=n.entities[G.currentGene.proteinQID];G.currentGene.proteinLabel=t.labels.en.value,G.currentGene.description=t.descriptions.en.value,G.currentGene.uniprot=t.claims.P352[0].mainsnak.datavalue.value,G.currentGene.refseqProt=t.claims.P637[0].mainsnak.datavalue.value,G.currentGene.productType=t.claims.P279[0].mainsnak.datavalue.value,G.currentGene.proteinAliases=[],angular.forEach(t.aliases.en,function(e){G.currentGene.proteinAliases.push(e.value)}),s.getOperonData(G.currentGene.entrez).then(function(e){var n=e.data.results.bindings;n.length>0?(G.annotations.currentOperon=n[0].operonItemLabel.value,G.opData=n,G.annotations.operons=n):(G.opData=[],G.annotations.operons=[])}),f.getRefSeqChrom(G.currentLocusTag).then(function(e){console.log(e),console.log("chromosome"),e[0]&&(G.currentGene.refseqGenome=e[0].refSeqChromosome.value)}),d.getExpression(function(n){G.expression=n;var t=e("keywordFilter")(n,G.currentLocusTag);G.currentExpression={},angular.forEach(t[0],function(e,n){"_id"!=n&&"$oid"!=n&&"timestamp"!=n&&(G.currentExpression[n]=e)}),G.annotations.expression=G.currentExpression});var a=G.currentGene.locusTag.replace("_","");g.getlocusTag2Pub(a).then(function(e){G.annotations.pubList=e.data.resultList.result}),i.getInterPro(G.currentGene.uniprot).then(function(e){G.ipData=e,G.annotations.interpro=e}),v.getHostPathogen(G.currentGene.uniprot).then(function(e){G.hostpathData=e,G.annotations.hostpath=e}),u.getGoTerms(G.currentGene.uniprot).then(function(e){G.annotations.go={cellcomp:[],bioproc:[],molfunc:[]},G.annotations.reaction={},G.mf="mf_button",G.bp="bp_button",G.cc="cc_button";var n=e.data.results.bindings;angular.forEach(n,function(e,n){e.hasOwnProperty("ecnumber")&&-1==G.annotations.ecnumber.indexOf(e.ecnumber.value)&&(G.annotations.ecnumber.push(e.ecnumber.value),angular.forEach(G.annotations.ecnumber,function(e){console.log(e),-1===e.indexOf("-")&&c.getReactionData(e).then(function(e){console.log(e),G.annotations.reaction[e.ecnumber]=e.reaction})})),"http://www.wikidata.org/entity/Q5058355"===e.goclass.value&&G.annotations.go.cellcomp.push(e),"http://www.wikidata.org/entity/Q14860489"===e.goclass.value&&G.annotations.go.molfunc.push(e),"http://www.wikidata.org/entity/Q2996394"===e.goclass.value&&G.annotations.go.bioproc.push(e)});var t={locusTag:G.currentGene.locusTag,taxid:G.currentGene.taxid,ec_number:G.annotations.ecnumber};o(t)})})});var o=function(e){var n=t.path()+"/mg_mutant_view";m.sendToView(n,e).then(function(e){G.annotations.mutants={mutants:e.data.mutants,refseq:G.currentGene.refseqGenome}})}}},templateUrl:"/static/wiki/js/app/main-page/main-page_new.html"});