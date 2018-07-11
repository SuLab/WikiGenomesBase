from pymongo import MongoClient
import pprint
import datetime
        
client = MongoClient()
db = client.chlamdb
collection = db.mutants
documents = collection.find({"mutant_type": 0})

for document in documents:
    pprint.pprint(document)

    pub = None
    
    if "pub" in document.keys():
        pub = document["pub"]
        if type(document["pub"]) is dict:
            pub = document['pub']['result']['uids'][0]
            
    doi = None
    if "doi" in document.keys():
        doi = document["doi"]
        
    entry = None

    if type(document["mutant_type"]) is dict:
      # chemical mutagenesis
      if document['mutant_type']['key'] == 1:
      
          entry = {
            "_id": document["_id"],
            "aa_effect": document["aa_effect"],
            "coordinate": {
                            "start": document["coordinate"]["start"],
                            "end": document["gff"]["end"]
                          },
            "locusTag": document["locusTag"],
            "mutant_type": 0,
            "name": document["name"],
            "pub": pub,
            "doi": doi,
            "ref_base": document["ref_base"],
            "variant_base": document["variant_base"],
            "snv_type": document["variant_type"]["id"],
            "date": datetime.datetime.utcnow()
          }
  
      # transposon mutagenesis
      if document['mutant_type']['key'] == 2:
      
          entry = {
            "_id": document["_id"],
            "coordinate": {
                            "start": document["coordinate"]["start"],
                            "end": document["gff"]["end"]
                          },
            "locusTag": document["locusTag"],
            "mutant_type": 1,
            "name": document["name"],
            "pub": pub,
            "doi": doi,
            "insert_direction": document["insert_direction"],
            "percent_gene_intact": document["percent_gene_intact"],
            "date": datetime.datetime.utcnow()
          }
        
      #if entry is not None:
        # delete then re-insert
        #collection.delete_one({"_id": entry["_id"]})
        #collection.insert_one(entry)
        #print(entry)