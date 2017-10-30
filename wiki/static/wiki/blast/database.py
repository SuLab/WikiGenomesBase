from Bio.Blast.Applications import NcbiblastnCommandline # Run blastn
import pandas as pd # pandas dataframe
from Bio import SeqIO #parsing all.fasta for locus tags
import os.path #check if db results have been run

# extract the corresponding locus tag from each entry
def getLocusTag(entry):
  entry = str(entry)
  if entry.find("locus_tag") != -1:
    entry = entry[entry.find("[locus_tag=") + 11:]
    return entry[:entry.find("]")]
  else:
    return "No Locus Tag"

# run the blast search if there is no raw data file
blastn_cline = NcbiblastnCommandline(query="all.fasta", db="Orthologs", out="unparsed.tab", outfmt="\"6 qacc sacc pident\"")
stdout, stderr = blastn_cline()

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
