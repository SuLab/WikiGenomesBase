from __future__ import absolute_import, unicode_literals
from wikigenomes.settings import BASE_DIR
from celery import shared_task
from scripts import genome_feature_data

import os

@shared_task
def assembly_summary():
    gfData = genome_feature_data.GenomeDataRetrieval()
    return gfData.get_assembly_summary()

@shared_task
def generate_reference():
    refObj = genome_feature_data.GenomeDataRetrieval()
    return refObj.generate_reference()

@shared_task
def getWikidataGenes():

    refObj = genome_feature_data.GenomeDataRetrieval()
    return refObj.getWikidataGenes()

@shared_task
def sparql2gff():

    refObj = genome_feature_data.GenomeDataRetrieval()
    return refObj.sparql2gff()

@shared_task
def xsum(numbers):
    return sum(numbers)

