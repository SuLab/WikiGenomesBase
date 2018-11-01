from SPARQLWrapper import SPARQLWrapper, JSON
import pprint
class WDSparqlQueries(object):
    """
    params: optional depending on type of query (for qid provide prop and string, for label provide qid)
    extendable wrapper for sparql queries in WD
    """

    def __init__(self, qid=None, prop=None, string=None, taxid=None):
        self.qid = qid
        self.prop = prop
        self.string = string
        self.taxid = taxid
        self.endpoint = SPARQLWrapper("https://query.wikidata.org/bigdata/namespace/wdq/sparql")
        self.wd = 'PREFIX wd: <http://www.wikidata.org/entity/>'
        self.wdt = 'PREFIX wdt: <http://www.wikidata.org/prop/direct/>'

    def execute_query(self, query):
        self.endpoint.setQuery(query)
        self.endpoint.setReturnFormat(JSON)
        return self.endpoint.query().convert()

    def wd_prop2qid(self):
        """
        :param prop: 'P351' Entrez gene id (ex. print( SPARQL_for_qidbyprop('P351','899959')))
        :param string: '899959' String value
        :return: QID Q21514037
        """
        arguments = '?gene wdt:{} "{}"'.format(self.prop, self.string)
        select_where = 'SELECT * WHERE {{{}}}'.format(arguments)
        query = self.wdt + " " + select_where
        results = self.execute_query(query)
        final_qid = []
        try:
            rawqid = results['results']['bindings'][0]['gene']['value']
            qid_list = rawqid.split('/')
            final_qid.append(qid_list[-1])
        except Exception:
            final_qid.append('None')
        self.qid = final_qid[0]
        return final_qid[0]

    def wd_qid2label(self, qid=None):
        """
        :param string: 'Q2458943' String value
        :return: QID 'Label'
        """
        if not qid:
            qid = self.qid
        arguments = ' wd:{} rdfs:label ?label. Filter (LANG(?label) = "en") .'.format(qid)
        select_where = 'SELECT ?label WHERE {{{}}}'.format(arguments)
        query = self.wd + " " + select_where
        results = self.execute_query(query)
        final_qid = []
        try:
            rawqid = results['results']['bindings'][0]['label']['value']
            final_qid.append(rawqid)
        except Exception:
            final_qid.append('None')
        return final_qid[0]

    def genes4tid(self):
        preQuery = '''
        SELECT ?start ?end ?strand ?uri ?entrezGeneID ?name ?description ?refSeq ?symbol WHERE {
          ?gene wdt:P279 wd:Q7187;
                wdt:P703 ?strain;
                wdt:P351 ?entrezGeneID;
                wdt:P2393 ?name;
                rdfs:label ?description;
                wdt:P644 ?start;
                wdt:P645 ?end;
                wdt:P2548 ?wdstrand ;
                p:P644 ?claim.
          ?strain wdt:P685 '{TAXID}'.
          ?claim pq:P1057/wdt:P2249 ?refSeq.
          OPTIONAL {?gene wdt:P2561 ?symbol.}
          bind( IF(?wdstrand = wd:Q22809680, '+', '-') as ?strand).
          bind(str(?gene) as ?uri).
          filter (lang(?description) = "en").
        }'''
        query = preQuery.replace('{TAXID}', self.taxid)
        results = self.execute_query(query)
        return results['results']['bindings']

    def operons4tid(self):
        preQuery = '''
        SELECT DISTINCT ?description ?strand  (MIN(?gstart) AS ?start)  (MAX(?gend) AS ?end) ?uri ?refSeq WHERE {
          ?strain wdt:P685 '{TAXID}'.
          ?operon (wdt:P279|wdt:P31) wd:Q139677;
                  wdt:P703 ?strain;
                  rdfs:label ?description;
                  wdt:P2548 ?wdstrand;
                  wdt:P527+ ?genes.
          ?genes wdt:P644 ?gstart;
                 wdt:P645 ?gend;
                 p:P644 ?claim.
          ?claim pq:P1057/wdt:P2249 ?refSeq.
          bind( IF(?wdstrand = wd:Q22809680, '+', '-') as ?strand).
          bind(str(?operon) as ?uri)
            filter (lang(?description) = "en").
        }
        GROUP BY ?uniqueID ?description ?strand ?uri ?prefix ?refSeq'''
        query = preQuery.replace('{TAXID}', self.taxid)
        results = self.execute_query(query)
        return results['results']['bindings']

    def locus2qid(self, locusTag, taxid):
        preQuery ='''
        SELECT distinct ?gene ?protein WHERE{
                ?strain wdt:P685 '{taxid}'. 
                ?gene wdt:P2393 '{locusTag}';
                wdt:P703 ?strain.
                OPTIONAL {?gene wdt:P688 ?protein.}}
        '''
        query = preQuery.replace('{taxid}', taxid).replace('{locusTag}', locusTag)
        results = self.execute_query(query)
        return results['results']['bindings']

    def locus2orthologs(self, locusTag):
        preQuery ='''
        SELECT ?ortholog ?protein ?orthoTaxid WHERE {
                       {
                          ?gene wdt:P2393 '{{locusTag}}'.
                          ?gene p:P684 ?statement.
                          ?statement ps:P684 ?ortholog. 
                          ?ortholog wdt:P2393 ?orthoLocusTag.
                          ?ortholog wdt:P703 ?orthoTaxon.
                          ?orthoTaxon wdt:P685 ?orthoTaxid.
                          OPTIONAL {
                            ?ortholog wdt:P688 ?protein.
                          }
                        }
                        UNION
                        {
                          ?gene wdt:P2393 '{{locusTag}}'.
                          ?gene wdt:P2393 ?orthoLocusTag.
                          ?gene wdt:P703 ?orthoTaxon.
                          ?orthoTaxon wdt:P685 ?orthoTaxid.
                          BIND(?gene AS ?ortholog).
                          OPTIONAL {
                            ?gene wdt:P688 ?protein.
                          }
                        }
                      }'''
        query = preQuery.replace('{{locusTag}}', locusTag)
        results = self.execute_query(query)
        return results['results']['bindings']

    def get_myxo_genes(self):
        query ='''
        SELECT REDUCED ?gene ?protein ?refseq WHERE {
          ?taxon wdt:P171*/wdt:P685 '34'.
          ?gene wdt:P703 ?taxon;
                wdt:P31 wd:Q7187;
                p:P31 ?claim.
          ?claim prov:wasDerivedFrom/pr:P2249 ?refseq.
          OPTIONAL {?gene wdt:P688 ?protein.}
        }
        ORDER BY ?gene
        '''
        results = self.execute_query(query)
        return results['results']['bindings']

    def get_old_terms(self):
        query ='''
        SELECT ?protein ?gotermValue ?goClass WHERE {

          ?taxon wdt:P171+ wd:Q846309.
          ?protein wdt:P703 ?taxon;
                   wdt:P279 wd:Q8054;
                   (p:P680|p:P681|p:P682)+ ?goterm.
        
          OPTIONAL {?goterm pq:P459/rdfs:label ?determination. FILTER(LANG(?determination) = 'en').}
        
          ?goterm (ps:P680|ps:P681|ps:P682)+ ?gotermValue.
          ?gotermValue wdt:P31 ?goClass.
          FILTER(BOUND(?determination) = false)
        }
        '''
        results = self.execute_query(query)
        return results['results']['bindings']

    def get_single_alias_genes(self):
        query = '''
        SELECT DISTINCT ?gene WHERE {
  
          ?gene wdt:P31|wdt:P279 wd:Q7187;
                skos:altLabel ?alias.
          
          FILTER(LANG(?alias) = "en" && strlen(?alias) = 1 && regex(?alias, "[A-Z,a-z]", "i")).
        }
        '''
        results = self.execute_query(query)
        return results['results']['bindings']

    def get_protein_from_uniprot(self, uniprot):
        query = '''
         SELECT ?protein WHERE {

            ?protein wdt:P31|wdt:P279 wd:Q8054;
               wdt:P352 '{}'.
            
         }
         LIMIT 1
         '''.replace("{}", uniprot)
        results = self.execute_query(query)
        return results['results']['bindings']


