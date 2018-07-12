from pymongo import MongoClient
import pprint
import datetime
        
client = MongoClient()
db = client.chlamdb
collection = db.mutants
documents = collection.find()

seq_map = {
  "synonymous": "SO:0001815",
  "non-synonymous": "SO:0001816",
  "non_transcribed_region": "SO:0000183",
  "silent_mutation": "SO:0001017",
  "stop_gained": "SO:0001587"
}

for document in documents:

    pub = None
    
    if "pub" in document.keys():
        pub = document["pub"]
        if type(document["pub"]) is dict:
            pub = document['pub']['result']['uids'][0]
            
    doi = None
    if "doi" in document.keys():
        doi = document["doi"]
        
    entry = None

    if "mutant_type" in document.keys() and type(document["mutant_type"]) is dict:
      # chemical mutagenesis
      if document['mutant_type']['key'] == 1:
      
          entry = {
            "_id": document["_id"],
            "chromosome": document["chromosome"],
            "taxid": document["taxid"],
            "aa_effect": document["aa_effect"],
            "coordinate": {
                            "start": document["coordinate"]["start"],
                            "end": document["gff"]["end"]
                          },
            "locusTag": document["locusTag"],
            "mutation_id": document["mutant_type"]["id"],
            "mutation_name": document["mutant_type"]["name"],
            "name": document["name"],
            "pub": pub,
            "doi": doi,
            "ref_base": document["ref_base"],
            "variant_base": document["variant_base"],
            "snv_id": seq_map[document["variant_type"]["name"]],
            "snv_name": document["variant_type"]["name"],
            "date": datetime.datetime.utcnow()
          }
  
      # transposon mutagenesis
      if document['mutant_type']['key'] == 2:
      
          entry = {
            "_id": document["_id"],
            "chromosome": document["chromosome"],
            "taxid": document["taxid"],
            "coordinate": {
                            "start": document["coordinate"]["start"],
                            "end": document["gff"]["end"]
                          },
            "locusTag": document["locusTag"],
            "mutation_id": "EFO_0004021",
            "mutation_name": "transposition",
            "name": document["name"],
            "pub": pub,
            "doi": doi,
            "insert_direction": document["insert_direction"],
            "percent_gene_intact": document["percent_gene_intact"],
            "date": datetime.datetime.utcnow()
          }
        
      if entry is not None:
        # delete then re-insert
        collection.delete_one({"_id": entry["_id"]})
        collection.insert_one(entry)
        #print(entry)