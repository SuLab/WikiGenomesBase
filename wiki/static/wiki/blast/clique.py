import pandas as pd
import os.path
import ast
import numpy as np
import matplotlib.pyplot as plt
from math import log10

# the 4 possible strains
strains = ["muridarum", "pneumoniae", "trachomatis_434", "trachomatis_duw"]

# read the cliques table
data = pd.read_table("results/cliques.tab", header=0)

# the new clique tables
clique4 = pd.DataFrame(columns=strains)
clique3 = pd.DataFrame(columns=strains)
clique2 = pd.DataFrame(columns=strains)

# extra details about strains with multiple or missing hits
outfile = open("results/cliques_details.txt", "w")
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

# find the missing strain in a given dataframe row
def getMissingStrains(row):
  missing = []
  for i, j in zip(row, strains):
    if i == "[]":
      missing.append(j)
  return missing

#hist = []
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

  # generate the details file
  outfile.write("Line " + str(index + 1) + ": " + str(row.values) + "\n\n")

  # get list of closest hits to missing  terms
  if size != 4:
    missing = getMissingStrains(row.values)
    outfile.write("\tMissing strain(s): %s\n" % str(missing))
    outfile.write("\tQuery Subject %_Similarity E_Value Length\n")

    # list the best hits for the missing strain v all others
    terms = []
    for i in row.values:
      l = ast.literal_eval(i)
      for item in l:
        terms.append(item)

    for m in missing:
      for query in terms:
        temp = pd.read_table("parsed_%s_v_%s.tab" % (m, getStrain(query)), header=0)
        rows = temp.loc[(temp["Query"] == query)]
        for index, target in rows.iterrows():
          outfile.write("\t%s\n" % str(target.values))
            
          # now do the reverse search
          temp = pd.read_table("parsed_%s_v_%s.tab" % (getStrain(target["Query"]), getStrain(target["Subject"])), header=0)
          other = temp.loc[(temp["Query"] == target["Subject"])]
          for i, t in other.iterrows():
            outfile.write("\t%s\n" % str(t.values))
    outfile.write("\n")

  # get a list of all terms to search for multiple hits
  terms = []
  if multiple:
    outfile.write("\tRepeated Hits\n")
    outfile.write("\tQuery Subject %_Similarity E_Value Length\n")
    for i in row.values:
      l = ast.literal_eval(i)
      for item in l:
        terms.append(item)

    # now get all the data for the individual comparisons in the repeated strains
    for query in terms:
      for subject in terms:
        if getStrain(query) != getStrain(subject):
          temp = pd.read_table("parsed_%s_v_%s.tab" % (getStrain(subject), getStrain(query)), header=0)
          rows = temp.loc[(temp["Query"] == query) & (temp["Subject"] == subject)]
          for index, target in rows.iterrows():
            outfile.write("\t%s\n" % str(target.values))
    outfile.write("\n")

  if size == 4 and not multiple:
    clique4 = clique4.append(pd.DataFrame([row.values], columns=strains))
  elif size >= 3:
    clique3 = clique3.append(pd.DataFrame([row.values], columns=strains))
    
    # add e value to histogram
    """terms = []
    for i in row.values:
      l = ast.literal_eval(i)
      for item in l:
        terms.append(item)
    for query in terms:
      for subject in terms:
        if getStrain(query) != getStrain(subject):
          temp = pd.read_table("parsed_%s_v_%s.tab" % (getStrain(subject), getStrain(query)), header=0)
          rows = temp.loc[(temp["Query"] == query) & (temp["Subject"] == subject)]
          for index, target in rows.iterrows():
            val = float(target["E Value"])
            if val > 0:
              hist.append(log10(val))
            else:
              hist.append(-200)"""

  elif size == 2:
    clique2 = clique2.append(pd.DataFrame([row.values], columns=strains))

outfile.close()

# draw the histogram
#print ("Displaying Histogram")
#plt.hist(hist)
#, bins=np.arange(min(hist), max(hist) + 10, 10))
#plt.show()

# now save the cliques to file
clique4.to_csv("results/cliques_4_rbm.tab", index=False, header=True, sep="\t")
clique3.to_csv("results/cliques_3_rbm.tab", index=False, header=True, sep="\t")
clique2.to_csv("results/cliques_2_rbm.tab", index=False, header=True, sep="\t")
