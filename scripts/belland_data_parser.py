import pandas as pd
import WD_Utils
import json

df = pd.read_csv("belland_data.tab", sep="\t", names=["gene", "description", "1h", "3h", "8h", "16h", "24h", "40h"], header=0)

genes = WD_Utils.WDSparqlQueries(taxid='272561').genes4tid()

data = {}

def parseInt(value):
    if value == "-":
        return 0
    else:
        return int(value)

for index, row in df.iterrows():
    if row["gene"]:
        pos = row["gene"].find("CT")
        locus = None
        if  pos != -1:
            locus = "CT_" + row["gene"][pos + 2:]
        else:
            for gene in genes:
                if gene.get("symbol") and gene["symbol"]["value"] == row["gene"]:
                    locus = gene["name"]["value"]
                    break

        if locus:
            data[locus] = {
                "1h": parseInt(row["1h"]),
                "3h": parseInt(row["3h"]),
                "8h": parseInt(row["8h"]),
                "16h": parseInt(row["16h"]),
                "24h": parseInt(row["24h"]),
                "40h": parseInt(row["40h"]),
            }

with open("belland_data.json", "w") as file:
    json.dump(data, file)