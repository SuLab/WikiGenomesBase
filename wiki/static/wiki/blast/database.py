from Bio.Blast.Applications import NcbiblastnCommandline # Run blastn
import pandas as pd # pandas dataframe
from Bio import SeqIO #parsing all.fasta for locus tags
import os.path #check if certain files have been made

# extract the corresponding locus tag from each entry
def getLocusTag(entry):
  entry = str(entry)
  if entry.find("locus_tag") != -1:
    entry = entry[entry.find("[locus_tag=") + 11:]
    return entry[:entry.find("]")]
  else:
    return "No Locus Tag"

# run the blast search if there is no raw data file
if os.path.isfile("unparsed.tab"):
  blastn_cline = NcbiblastnCommandline(query="all.fasta", db="Orthologs", out="unparsed.tab", outfmt="\"6 qacc sacc pident\"")
  stdout, stderr = blastn_cline()

# check if data is parsed
if not os.path.isfile("data.tab"):
  # dictionary that links each accession id to a locus tag
  ids = {}
  for seq_record in SeqIO.parse("all.fasta", "fasta"):
    ids[seq_record.id] = getLocusTag(seq_record.description)
    ids[seq_record.id[4:]] = getLocusTag(seq_record.description)

  # read the results from the blast search
  data = pd.read_table("unparsed.tab", names=["Query", "Subject", "% Similarity"])

  # now update all the accession numbers to the corresponding locus tag
  data.replace(ids, inplace=True)

  # now save it to a new formatted data file
  data.to_csv("data.tab", index=False, header=True, sep="	")

# now read from the parsed data tab
data = pd.read_table("data.tab", header=0);

# list of loci with their best match(es)
ids = {}

# now iterate through all entries in the table
for index, row in data.iterrows():

  # do a comparison check if id is already in the dict
  if row["Query"] in ids:

    # get the dictionary associated with the query
    dic = ids[row["Query"]]

    # this is the similarity of the last item added
    val = float(dic[next(iter(dic))]) 

    #check if current row's similarity is greater than what is in the tree
    if val < float(row["% Similarity"]):
      
      # now replace the existing entry with the match that is closer
      ids[row["Query"]] = {row["Subject"] : row["% Similarity"]}

    # if equal then also add this entry to the table
    elif val == float(row["% Similarity"]):
      dic[row["Subject"]] = row["% Similarity"]
  
  # Add a probable reciprocal best hit with this row by default if not itself
  elif row["Query"] != row["Subject"]:
      ids[row["Query"]] = {row["Subject"] : row["% Similarity"]}

  # No best match found
  else:
      ids[row["Query"]] = {"None" : "0"}

# list of entries that are not reciprocal best matches
not_rbm = []

# now we confirm if each entry's reciprocal best match is each other
for entry in ids:

  # check if the entry has a best match
  if "None" in ids[entry]:
    not_rbm.append(entry)
    continue
  
  # iterate through all potential best matches
  for subject in ids[entry]:

    # Add to list of not best matches if the subject does not agree with the query
    if entry not in ids[subject]:
      not_rbm.append(entry)
      continue

# now write the list of non reciprocal best matches to file
outfile = open("non_rbm.txt", "w")
for entry in not_rbm:
  outfile.write("%s\n" % entry)

# now write the list of reciprocal best matches to file
data = pd.DataFrame(columns=["Query", "Best Match(es)"])
for entry in ids:
  if entry not in not_rbm:
    data = data.append(pd.DataFrame([[entry, ids[entry]]], columns=["Query", "Best Match(es)"]))
data.to_csv("rbm.tab", index=False, header=True, sep="	")
