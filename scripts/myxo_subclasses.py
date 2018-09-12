import WD_Utils
from wikidataintegrator import wdi_core, wdi_login
import getpass

username = input("Username: ")
password = getpass.getpass("Password: ")
count = 0

sparql = WD_Utils.WDSparqlQueries()
login = wdi_login.WDLogin(user=username, pwd=password)

def buildRefs(refseq):
    refs = [wdi_core.WDItemID(value="Q7307074", prop_nr='P248', is_reference=True)]
    refs.append(wdi_core.WDTime("+2018-09-12T00:00:00Z", prop_nr='P813', is_reference=True))
    refs.append(wdi_core.WDExternalID(value=refseq, prop_nr='P2249', is_reference=True))
    return refs

def write2wikidata(qid,refseq, pqid):
    print("%s %s %s" % (qid, refseq, pqid))
    if qid and refseq:
        refs = buildRefs(refseq)
        statements = [wdi_core.WDItemID(value="Q7187", prop_nr='P279', references=[refs])]
        if pqid:
            statements.append(wdi_core.WDItemID(value="Q20747295", prop_nr='P279', references=[refs]))
            protein = wdi_core.WDItemEngine(wd_item_id=pqid, data=[wdi_core.WDItemID(value="Q8054", prop_nr='P279', references=[refs])])
            protein.write(login=login)
        gene = wdi_core.WDItemEngine(wd_item_id=qid, data=statements)
        gene.write(login=login)


data = sparql.get_myxo_genes()

for gene in data:

    qid = gene["gene"]["value"].split("/")[-1]
    if gene.get("protein"):
        pqid = gene["protein"]["value"].split("/")[-1]
    if gene.get("refseq"):
        refseq = gene["refseq"]["value"]
    write2wikidata(qid, refseq, pqid)
