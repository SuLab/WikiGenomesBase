import WD_Utils
from wikidataintegrator import wdi_core, wdi_login
import threading

username = "djow2019"
password = input("Password:\n")
count = 0

sparql = WD_Utils.WDSparqlQueries()
login = wdi_login.WDLogin(user=username, pwd=password)
ref = wdi_core.WDItemID(value="Q22065557", prop_nr='P248', is_reference=True)

def write2wikidata(qid, value):
    print("%s %s" % (qid, value))
    statement = wdi_core.WDMonolingualText(value=value, prop_nr='P2561', references=[[ref]])
    item = wdi_core.WDItemEngine(wd_item_id=qid, data=[statement], domain=None, use_sparql=True)
    item.write(login=login)

with open("chlamydia.tsv", "r") as file:
    file.readline()
    file.readline()

    for line in file:

        if count >= 783:
            line = line.split("\t")
            if line[4] != "-":
                results = sparql.locus2orthologs(locusTag=line[1])
                for result in results:
                    for key in result:
                        qid = result[key]["value"].split("/")[-1]
                        #thread = threading.Thread(target=write2wikidata, args=(qid, line[4],))
                        #thread.start()
                        write2wikidata(qid, line[4])

        count = count + 1