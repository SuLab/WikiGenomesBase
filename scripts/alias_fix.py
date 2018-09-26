import WD_Utils
from wikidataintegrator import wdi_core, wdi_login
import getpass

username = input("Username: ")
password = getpass.getpass("Password: ")
count = 0

sparql = WD_Utils.WDSparqlQueries()
login = wdi_login.WDLogin(user=username, pwd=password)

def write2wikidata(qid):
    print("%s" % (qid))
    item = wdi_core.WDItemEngine(wd_item_id=qid)
    aliases = [alias for alias in item.get_aliases() if len(alias) > 1]
    item.set_aliases(aliases, append=False)
    item.write(login=login)

data = sparql.get_single_alias_genes()

for gene in data:

    qid = gene["gene"]["value"].split("/")[-1]
    write2wikidata(qid)