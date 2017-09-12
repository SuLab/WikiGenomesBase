#!/usr/bin/env python
from wiki import tasks
from pymongo import MongoClient

client = MongoClient()
genomes = client.genomes
genomes.assembly_summary.remove()
genomes.genes.remove()
tasks.get_wd_genome_data()
tasks.generate_org_list()
tasks.generate_app_name()
tasks.get_wd_features()