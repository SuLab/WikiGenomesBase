import WD_Utils
from wikidataintegrator import wdi_core, wdi_login

username = "djow2019"
password = input("Password:\n")
count = 0
taxid = '471472'
eb = 'Q51955212'
rb = 'Q51955198'

sparql = WD_Utils.WDSparqlQueries()
login = wdi_login.WDLogin(user=username, pwd=password)
ref = wdi_core.WDItemID(value="Q35577557", prop_nr='P248', is_reference=True)

def write2wikidata(qid, property, value, qualifiers=None):
    print("%s %s %s" % (qid, value, qualifiers))
    statement = wdi_core.WDItemID(value=value, prop_nr=property, references=[[ref]], qualifiers=qualifiers)
    item = wdi_core.WDItemEngine(wd_item_id=qid, data=[statement], domain=None, use_sparql=True, append_value=[property])
    item.write(login=login)

def findAndSetIncreasedForm(qid, first, second):
    if first > 0 and second > 0:
        if first >= 4 * second:
            write2wikidata(qid, 'P1911', eb, [wdi_core.WDItemID(value=rb, prop_nr='P2210', is_qualifier=True)])
        elif second >= 4 * first:
            write2wikidata(qid, 'P1911', rb, [wdi_core.WDItemID(value=eb, prop_nr='P2210', is_qualifier=True)])
    else:
        return

with open("developmentalForms.txt", "r") as file:
    file.readline()
    file.readline()
    file.readline()

    for line in file:

        if count >= 90 and count <= 484:
            line = line.split("\t")
            qid = sparql.locus2qid(locusTag=line[0], taxid=taxid)
            if len(qid) > 0:
                qid = qid[0]["protein"]["value"].split("/")[-1]
                if int(line[6]) > 0:
                    value = eb
                    write2wikidata(qid, 'P5572', value)
                if int(line[7]) > 0:
                    value = rb
                    write2wikidata(qid, 'P5572', value)
                findAndSetIncreasedForm(qid, int(line[6]), int(line[7]))
            else:
                print("MISSING LOCUS TAG: %s" % line[0])
        count = count + 1