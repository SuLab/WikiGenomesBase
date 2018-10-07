import WD_Utils
from wikidataintegrator import wdi_core, wdi_login
import json
import getpass

username = input("Username: ")
password = getpass.getpass("Password: ")

login = wdi_login.WDLogin(user=username, pwd=password)

map = {
    "Q2996394": "P682",
    "Q5058355": "P681",
    "Q14860489": "P680"
}

sparql = WD_Utils.WDSparqlQueries()

def write2wikidata(qid, goTerm, prop):
    print("%s %s %s" % (qid, prop, goTerm))
    statement = wdi_core.WDItemID(value=goTerm, prop_nr=prop)
    setattr(statement, 'remove', '')

    item = wdi_core.WDItemEngine(wd_item_id=qid, data=[statement])
    item.write(login=login)

data = sparql.get_old_terms()

for protein in data:

    qid = protein["protein"]["value"].split("/")[-1]
    goTerm = protein["gotermValue"]["value"].split("/")[-1]
    goClass = protein["goClass"]["value"].split("/")[-1]

    if goClass in map.keys():
        write2wikidata(qid, goTerm, map[goClass])
