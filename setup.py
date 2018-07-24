#!/usr/bin/env python
from wiki import tasks
from pymongo import MongoClient
from application_settings import mongo_database

# get mongo client and database
client = MongoClient()
db = client[mongo_database]

tasks.generate_org_list()        # generate the list of organisms in json so front end can access easily
tasks.generate_jbrowse_data()    # generate the core Jbrowse data (ref seq and gene annotations)
tasks.update_jbrowse_genes()     # update the jbrowse instance with wikidata gene data related to the taxids
tasks.update_jbrowse_mutants()   # update the jbrowse instance with mongo mutant data related to the taxids
tasks.update_jbrowse_operons()   # update the jbrowse instance with wikidata operon data related to the taxids