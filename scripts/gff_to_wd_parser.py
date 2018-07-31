from wikidataintegrator import wdi_core, wdi_login
import re
from pprint import pprint
import json

name = input("Enter the file name with extension:\n")

data = []
with open(name, "r") as file:
	lines = file.readlines()
	index = 0
	for line in lines:
		if "#" not in line:
			gff = line.split("\t")
			if gff[2] == "region":
				data.append(re.search(r'taxon:\d+', gff[8], re.M).group().split(":")[1])
			if gff[2] == "gene":
				gene = {}
				gene['chromosome'] = gff[0]
				gene['start'] = gff[3]
				gene['end'] = gff[4]
				gene['strand'] = gff[6]
				gene['name'] = re.search(r'Name=\w+;?', gff[8], re.M).group().split("=")[1].replace(";", "")
				gene['locus_tag'] = re.search(r'locus_tag=\w+;?', gff[8], re.M).group().split("=")[1].replace(";", "")
				
				match = re.search(r'old_locus_tag=\w+;?', gff[8], re.M)
				if match is not None:
					gene['alias'] = match.group().split("=")[1].replace(";", "")
				
				if lines[index + 1]:
					gff = lines[index + 1].split("\t")
					if gff[1] == "Protein Homology":
						gene['protein'] = {
							'refseq': re.search(r'Genbank:[^;]+;?', gff[8], re.M).group().split(":")[1].replace(";", ""),
							'product': re.search(r'product=[^;]+;?', gff[8], re.M).group().split("=")[1].replace(";", "")
						}
				data.append(gene)
				
		index = index + 1	
				
parsed = name.split(".")[0] + ".json"
with open(parsed, "w") as file:
	json.dump(data, file)
		