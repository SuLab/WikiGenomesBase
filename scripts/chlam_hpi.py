import WD_Utils
from wikidataintegrator import wdi_core, wdi_login
import getpass

username = "djow2019"
password = getpass.getpass("Password:\n")
count = 0

d_strain = "272561"
l2_strain = "471472"

sparql = WD_Utils.WDSparqlQueries()
login = wdi_login.WDLogin(user=username, pwd=password)
ref = wdi_core.WDItemID(value="Q37840078", prop_nr='P248', is_reference=True)
qualifier = wdi_core.WDItemID(value="Q32860428", prop_nr='P459', is_qualifier=True)

def write2wikidata(qid, hp_qid):
    print("%s %s" % (qid, hp_qid))
    statement = wdi_core.WDItemID(value=hp_qid, prop_nr='P129', qualifiers=[qualifier], references=[[ref]])
    item = wdi_core.WDItemEngine(wd_item_id=qid, data=[statement], domain=None, append_value='P129')
    item.write(login=login)

with open("chlam_hpis.tsv", "r") as file:

    for line in file:

        if count < 3:
            line = line.split("\t")
            if line[0]:
                results = sparql.locus2orthologs(locusTag=line[0])
                for result in results:
                    if result.get("protein") and (result["orthoTaxid"]["value"] == l2_strain or
                                                  result["orthoTaxid"]["value"] == d_strain):

                        qid = result["protein"]["value"].split("/")[-1]

                        hpi_result = sparql.get_protein_from_uniprot(line[1])
                        if len(hpi_result) > 0 and hpi_result[0].get("protein") and hpi_result[0]["protein"]["value"]:
                            write2wikidata(qid, hpi_result[0]["protein"]["value"].split("/")[-1])

        count = count + 1