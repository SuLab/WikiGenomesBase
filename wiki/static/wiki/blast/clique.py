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

# extra details about strains with multiple hits for 3 clique
outfile = open("results/cliques_3_details.txt", "w")
cliqDetails = pd.DataFrame(columns=["Query", "Subject", "% Similarity", "E Value", "Length"])

# to determine the strain from the locus tag
def getStrain(tag):
  if "TC" in tag:
    return "muridarum"
  elif "CP" in tag:
    return "pneumoniae"
  elif "CTL" in tag:
    return "trachomatis_434"
  elif "CT" in tag:
    return "trachomatis_duw"
  else:
    return "Unknown"

line = 1
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
    line = line + 1

    # get a list of all terms to search for
    terms = []
    if multiple:
      outfile.write("Line " + str(line) + ": " + str(row.values) + "\n\n")
      outfile.write("\tQuery Subject %_Similarity E_Value Length\n")
      for i in row.values:
        l = ast.literal_eval(i)
        for item in l:
          terms.append(item)

      # now get all the data for the individual comparisons
      for query in terms:
        for subject in terms:
          if getStrain(query) != getStrain(subject):
            temp = pd.read_table("parsed_%s_v_%s.tab" % (getStrain(subject), getStrain(query)), header=0)
            rows = temp.loc[(temp["Query"] == query) & (temp["Subject"] == subject)]
            for index, target in rows.iterrows():
              outfile.write("\t%s\n" % str(target.values))
      outfile.write("\n")

outfile.close()

# now save the cliques to file
clique4.to_csv("results/cliques_4_rbm.tab", index=False, header=True, sep="\t")
clique3.to_csv("results/cliques_3_rbm.tab", index=False, header=True, sep="\t")
