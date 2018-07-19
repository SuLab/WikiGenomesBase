from pymongo import MongoClient
import pprint
        
client = MongoClient()
old_collection = client.genomes.mutants
new_collection = client.chlamdb.mutants

old = []
for document in old_collection.find().sort("locusTag"):
  old.append(document["locusTag"])
  
new = []
for document in new_collection.find().sort("locusTag"):
  new.append(document["locusTag"])
  
  
with open("old.txt", "w") as f:
  f.write(" ".join(old))
  
with open("new.txt", "w") as f:
  f.write(" ".join(new))