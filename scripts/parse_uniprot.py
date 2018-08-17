import json

myxopath = "dk1622.json"

with open(myxopath, "r") as file:
    myxodb = json.load(file)

myxotax = myxodb[0]

with open("myxo_uniprot.tab", "r") as file:
    file.readline()
    for line in file:
        info = line.split("\t")

        for gene in myxodb:
            if type(gene) is dict and ("alias" in gene.keys() and gene["alias"] == info[1]):
                gene['uniprot'] = info[0]
                gene['symbol'] = info[2]
                gene['embl'] = info[6].split(';')[0]
                gene['ensembl'] = info[7].split(";")[0]
                break

with open(myxopath, "w") as file:
    json.dump(myxodb, file)