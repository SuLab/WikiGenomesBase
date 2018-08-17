import json

myxopath = "dzf1_parsed.json"

with open(myxopath, "r") as file:
    myxodb = json.load(file)

for gene in myxodb[0]:
    name = gene['name']
    updated = name + " " + gene['locus_tag']
    gene['symbol'] = updated[0].lower() + updated[1:]
    gene['name'] = updated[0].upper() + updated[1:]

with open(myxopath, "w") as file:
    json.dump(myxodb, file)