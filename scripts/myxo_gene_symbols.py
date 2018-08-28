import WD_Utils
from wikidataintegrator import wdi_core, wdi_login
import json

username = "MicrobeBot"
password = "tK4CdCQv4IeU"
count = 0

sparql = WD_Utils.WDSparqlQueries()
login = wdi_login.WDLogin(user=username, pwd=password)

def buildRefs(uniprot):
    refs = [wdi_core.WDItemID(value="Q905695", prop_nr='P248', is_reference=True)]
    refs.append(wdi_core.WDTime("+2018-08-09T00:00:00Z", prop_nr='P813', is_reference=True))
    refs.append(wdi_core.WDExternalID(value=uniprot, prop_nr='P352', is_reference=True))
    return refs

def write2wikidata(qid, aliases, value="", uniprot=""):
    print("%s %s %s %s" % (qid, aliases, value, uniprot))
    if value and uniprot:
        statement = wdi_core.WDMonolingualText(value=value, prop_nr='P2561', references=[buildRefs(uniprot)])
        item = wdi_core.WDItemEngine(wd_item_id=qid, data=[statement])
    else:
        item = wdi_core.WDItemEngine(wd_item_id=qid)

    item.set_aliases(aliases)
    item.write(login=login)

with open("dk1622.json", "r") as file:
    data = json.load(file)

for gene in data:

    if type(gene) is not dict:
        continue

    if count > 6 and gene.get("uniprot"):
        results = sparql.locus2orthologs(locusTag=gene["locus_tag"])
        for result in results:
            for key in result:
                qid = result[key]["value"].split("/")[-1]
                write2wikidata(qid, [gene["alias"]], gene["symbol"], gene["uniprot"])

    count = count + 1