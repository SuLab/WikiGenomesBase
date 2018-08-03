import WD_Utils
from wikidataintegrator import wdi_core, wdi_login

username = "djow2019"
password = ""

cttax = "272561"
count = 0
with open("chlamydia.tsv", "r") as file:
    file.readline()
    file.readline()
    sparql = WD_Utils.WDSparqlQueries()
    
    login = wdi_login.WDLogin(user=username, pwd=password)

    ref = wdi_core.WDItemID(value="Q22065557", prop_nr='P248', is_reference=True)
    
    for line in file:
        line = line.split("\t")

        if (line[0] != "NA") and line[4] != "-":
        
            line[0] = line[0][0:2] + "_" + line[0][2:]
            results = sparql.locus2qid(locusTag=line[0], taxid=cttax)
            if len(results) > 0:
                for key in results[0]:
                    qid = results[0][key]["value"].split("/")[-1]
                    statement = wdi_core.WDMonolingualText(value=line[4], prop_nr='P2561', references=[[ref]])
                    item = wdi_core.WDItemEngine(wd_item_id=qid, data=[statement], append_value=['P2561'], domain=None, use_sparql=True)
                    item.write(login=login)
                
        if (line[1] != "NA") and line[4] != "-":
            results = sparql.locus2qid(locusTag=line[1], taxid=line[3])
            if len(results) > 0:
                for key in results[0]:
                    qid = results[0][key]["value"].split("/")[-1]
                    statement = wdi_core.WDMonolingualText(value=line[4], prop_nr='P2561', references=[[ref]])
                    item = wdi_core.WDItemEngine(wd_item_id=qid, data=[statement], append_value=['P2561'], domain=None, use_sparql=True)
                    item.write(login=login)
        count = count + 1
        if count == 2:
            break;