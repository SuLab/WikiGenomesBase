from pymongo import MongoClient

collection = MongoClient().chlamdb.mutants

for document in collection.find():
	print(document)
	start = document['coordinate']['start']
	end = document['coordinate']['end']
	
	if start.find(",") != -1 or end.find(",") != -1:
		document['coordinate']['start'] = start.replace(",", "")
		document['coordinate']['end'] = end.replace(",", "")
		collection.find_one_and_update({"_id": document['_id']}, {"$set": document}, upsert=False)
		print(collection.find_one({"_id": document['_id']}))