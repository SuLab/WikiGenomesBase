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
        return final_qid[0]

    def wd_qid2label(self):
        """
        :param string: 'Q2458943' String value
        :return: QID 'Label'
        """
        arguments = ' wd:{} rdfs:label ?label. Filter (LANG(?label) = "en") .'.format(self.qid)
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
        queryPrefixes = '''PREFIX wdt: <http://www.wikidata.org/prop/direct/>
        PREFIX wd: <http://www.wikidata.org/entity/> PREFIX qualifier:
        <http://www.wikidata.org/prop/qualifier/>'''
        preQuery = '''SELECT ?start ?end ?uniqueID ?strand ?uri ?entrezGeneID ?name ?description ?refSeq
        WHERE {
        ?gene wdt:P279 wd:Q7187;
        wdt:P703 ?strain;
        wdt:P351 ?uniqueID;
        wdt:P351 ?entrezGeneID;
        wdt:P2393 ?name;
        rdfs:label ?description;
        wdt:P644 ?start;
        wdt:P645 ?end;
        wdt:P2548 ?wdstrand ;
        p:P644 ?chr.
        ?strain wdt:P685 '{TAXID}'.
        bind( IF(?wdstrand = wd:Q22809680, '+', '-') as ?strand).
        bind(str(?gene) as ?uri).
        filter (lang(?description) = "en").
        OPTIONAL {?chr qualifier:P2249 ?refSeq.}
         }'''
        query = preQuery.replace('{TAXID}', self.taxid)
        results = self.execute_query(queryPrefixes + query)
        return results['results']['bindings']

    def operons4tid(self):
        queryPrefixes = '''PREFIX wdt: <http://www.wikidata.org/prop/direct/>
        PREFIX wd: <http://www.wikidata.org/entity/>
        PREFIX qualifier: <http://www.wikidata.org/prop/qualifier/>'''
        preQuery = '''SELECT ?uniqueID ?description ?strand  (MIN(?gstart) AS ?start)  (MAX(?gend) AS ?end) ?uri ?refSeq
        WHERE {
        ?strain wdt:P685 '{TAXID}'.
        ?operon wdt:P279 wd:Q139677;
        wdt:P703 ?strain;
        rdfs:label ?description;
        wdt:P2548 ?wdstrand;
        wdt:P527 ?genes.
        ?genes wdt:P644 ?gstart;
        wdt:P645 ?gend;
        p:P644 ?chr.
        filter (lang(?description) = "en").
        OPTIONAL {?chr qualifier:P2249 ?refSeq.}
        bind( IF(?wdstrand = wd:Q22809680, '1', '-1') as ?strand).
        bind(str(?operon) as ?uri)
        bind( strafter( str(?operon), "entity/" ) as ?uniqueID ).
        }
        GROUP BY ?uniqueID ?description ?strand ?uri ?prefix ?refSeq'''
        query = preQuery.replace('{TAXID}', self.taxid)
        results = self.execute_query(queryPrefixes + query)
        return results['results']['bindings']




