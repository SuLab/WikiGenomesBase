from __future__ import absolute_import, unicode_literals
from wikigenomes.settings import BASE_DIR
from celery import shared_task
from scripts import jbrowse_configuration, flatfile_ingestion, WD_Utils
from application_settings import taxids, title
from pymongo import MongoClient
from bson.json_util import dumps
from pprint import pprint
import os

def generate_org_list():
    """
    generate_org_list()
        Generates a json list of taxids and qids for organisms
        in this database
        
        Used in search page organism filter, and taxid filter
        in browsing page
    """
    orgList = []
    for id in taxids:
        sparql = WD_Utils.WDSparqlQueries(prop='P685', string=str(id))
        qid = sparql.wd_prop2qid()
        org = {
            'taxon': 'http://www.wikidata.org/entity/{}'.format(qid),
            'taxonLabel': sparql.wd_qid2label(),
            'taxid': id
        }
        orgList.append(org)

    filepath = BASE_DIR + '/wiki/static/wiki/json/orgsList.json'
    with open(filepath, 'w') as outFile:
        print(dumps(orgList), file=outFile)

def generate_jbrowse_data():
    """
    generate_jbrowse_data()
        gather genomic data and configures genome level feature tracks for jbrowse
    """
    for taxid in taxids:
        refObj = jbrowse_configuration.GenomeDataRetrieval(taxid=taxid)
        refObj.generate_reference_sequence()
        refObj.generate_tracklist()
      
@shared_task
def update_jbrowse_genes():
    """
    update_jbrowse_genes()
        Updates gene information in JBrowse window for all taxids
    """
    for taxid in taxids:
        refObj = jbrowse_configuration.FeatureDataRetrieval(taxid=taxid)
        refObj.genes2gff()
      
@shared_task
def update_jbrowse_mutants():
    """
    update_jbrowse_mutants()
        Updates mutant information in JBrowse window for all taxids
    """
    for taxid in taxids:
        refObj = jbrowse_configuration.FeatureDataRetrieval(taxid=taxid)
        refObj.mutants2gff()
    
@shared_task
def update_jbrowse_operons():
    """
    update_jbrowse_operons()
        Updates operon information in JBrowse window for all taxids
    """
    for taxid in taxids:
        refObj = jbrowse_configuration.FeatureDataRetrieval(taxid=taxid)
        refObj.operons2gff()

def generate_app_name():
    """
    DeprecationWarning
    """
    jsonpath = BASE_DIR + '/wiki/static/wiki/json/'
    filepath = jsonpath + 'appData.json'
    name = [{
        'appName': title
    }]
    with open(filepath, 'w') as outfile:
        print(dumps(name), file=outfile)

@shared_task
def update_orthologues():
    """
    
    DeprecationWarning
    
    converts orthologue csv flatfile to mongo to json for application usage
    :return:
    """
    taskLog =[]
    refObj = flatfile_ingestion.Flatfile2Mongo(fileName='chlamydia_locus_tag_lookup.csv')
    taskLog.append(refObj.ortho2mongo())
    taskLog.append(refObj.ortho_mongo2json())
    return taskLog
