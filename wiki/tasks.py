from __future__ import absolute_import, unicode_literals
from wikigenomes.settings import BASE_DIR
from celery import shared_task
from scripts import jbrowse_configuration, flatfile_ingestion, WD_Utils
from application_settings import taxids, modules, application, orgTree
from pymongo import MongoClient
from bson.json_util import dumps
from pprint import pprint
import os

def generate_application_settings():
    """
    generate_application_settings()
        Generates a json setting file of the names to use in the application
    """
    filepath = BASE_DIR + '/wiki/static/wiki/json/application_data.json'
    with open(filepath, 'w') as outFile:
        print(dumps(application), file=outFile)

def generate_org_tree():
    """
    generate_org_tree()
        Generates a json file of the google org tree displayed on the landing page
    """
    filepath = BASE_DIR + '/wiki/static/wiki/json/org_tree.json'
    with open(filepath, 'w') as outFile:
        print(dumps(orgTree), file=outFile)

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
		
def generate_module_settings():
    """
    generate_module_settings()
        Generates a json setting file of the modules specified in application_settings
        
        Used to determine which modules to display in the annotation view
    """
    filepath = BASE_DIR + '/wiki/static/wiki/json/module_settings.json'
    with open(filepath, 'w') as outFile:
        print(dumps(modules), file=outFile)

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
def update_jbrowse_mutants(taxid=None):
    """
    update_jbrowse_mutants()
        Updates mutant information in JBrowse window for all taxids
    :param taxid: the taxid of the JBrowse mutant canvas to update
    """
    if taxid is None:
        for taxid in taxids:
            refObj = jbrowse_configuration.FeatureDataRetrieval(taxid=taxid)
            refObj.mutants2gff()
    else:
        refObj = jbrowse_configuration.FeatureDataRetrieval(taxid=taxid)
        refObj.mutants2gff()
    
@shared_task
def update_jbrowse_operons(taxid=None):
    """
    update_jbrowse_operons()
        Updates operon information in JBrowse window for all taxids
    :param taxid: the taxid of the JBrowse operon canvas to udpate
    """
    if taxid is None:
        for taxid in taxids:
            refObj = jbrowse_configuration.FeatureDataRetrieval(taxid=taxid)
            refObj.operons2gff()
    else:
        refObj = jbrowse_configuration.FeatureDataRetrieval(taxid=taxid)
        refObj.operons2gff()

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
