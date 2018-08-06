import json

myxopath = "dk1622.json"

with open(myxopath, "r") as file:
    myxodb = json.load(file)

myxotax = myxodb[0]

with open("gene_history", "r") as file:
    file.readline()
    for line in file:
        info = line.split("\t")
        tax = info[0]
        entrez = info[2]
        name = info[3]

        if tax == myxotax:
            for gene in myxodb:
                if type(gene) is dict and (("name" in gene.keys() and gene["name"] == name) or ("alias" in gene.keys() and gene["alias"] == name)):
                    gene["deprecated_entrez_id"] = entrez
                    break

with open(myxopath, "w") as file:
    json.dump(myxodb, file)