import pandas as pd
import os.path
import ast

# the 4 possible strains
strains = ["muridarum", "pneumoniae", "trachomatis_434", "trachomatis_duw"]

# read the cliques table
data = pd.read_table("results/cliques.tab", header=0)

# the new clique tables
clique4 = pd.DataFrame(columns=strains)
clique3 = pd.DataFrame(columns=strains)

# now iterate through each row
for index, row in data.iterrows():
  size = 0
  multiple = False
  for item in row.values:
    l = ast.literal_eval(item)
    if len(l) > 0:
      size = size + 1
    if len(l) > 1:
      multiple = True
  if size == 4 and not multiple:
    clique4 = clique4.append(pd.DataFrame([row.values], columns=strains))
  elif size >= 3:
    clique3 = clique3.append(pd.DataFrame([row.values], columns=strains))

# now save the cliques to file
clique4.to_csv("results/cliques_4_rbm.tab", index=False, header=True, sep="\t")
clique3.to_csv("results/cliques_3_rbm.tab", index=False, header=True, sep="\t")
