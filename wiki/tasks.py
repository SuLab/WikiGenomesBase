from __future__ import absolute_import, unicode_literals
from wikigenomes.settings import BASE_DIR
from celery import shared_task
from scripts import jbrowse_configuration, flatfile_ingestion, WD_Utils
from wikigenomes_conf import taxids, title
from pymongo import MongoClient
from bson.json_util import dumps
from pprint import pprint
import os


def generate_org_list():
    jsonpath = BASE_DIR + '/wiki/static/wiki/json/'
    client = MongoClient()
    genomes = client.genomes
    assembly_sum = genomes.assembly_summary
    cursor = assembly_sum.find()
    orgList = []
    for cur in cursor:
        pprint(cur)
        sparql = WD_Utils.WDSparqlQueries(prop='P685', string=cur['_id'])
        qid = sparql.wd_prop2qid()
        cur['taxon'] = 'http://www.wikidata.org/entity/{}'.format(qid)
        cur['taxonLabel'] = cur['organism_name']
        orgList.append(cur)

    filepath = jsonpath + 'orgsList.json'
    with open(filepath, 'w') as outFile:
        print(dumps(orgList), file=outFile)


def generate_app_name():
    jsonpath = BASE_DIR + '/wiki/static/wiki/json/'
    filepath = jsonpath + 'appData.json'
    name = [{
        'appName': title
    }]
    with open(filepath, 'w') as outfile:
        print(dumps(name), file=outfile)



@shared_task
def get_wd_genome_data():
    """
    gather genomic data and configures genome level feature tracks for jbrowse
    :return:
    """
    taskLog = []
    for taxid in taxids:
        refObj = jbrowse_configuration.GenomeDataRetrieval(taxid=taxid)
        taskLog.append(refObj.get_assembly_summary())
        taskLog.append(refObj.generate_reference())
        taskLog.append(refObj.generate_tracklist())
    return taskLog


@shared_task
def get_wd_features():
    """
    gather feature data and configures .gff files for jbrowse
    :return:
    """
    taskLog = []
    for taxid in taxids:
        refObj = jbrowse_configuration.FeatureDataRetrieval(taxid=taxid)
        taskLog.append(refObj.get_wd_genes())
        taskLog.append(refObj.get_wd_operons())
        # taskLog.append(refObj.get_mutants())
        taskLog.append(refObj.genes2gff())
        taskLog.append(refObj.operons2gff())
        taskLog.append(refObj.mutants2gff())
    return taskLog


@shared_task
def update_orthologues():
    """
    converts orthologue csv flatfile to mongo to json for application usage
    :return:
    """
    taskLog =[]
    refObj = flatfile_ingestion.Flatfile2Mongo(fileName='chlamydia_locus_tag_lookup.csv')
    taskLog.append(refObj.ortho2mongo())
    taskLog.append(refObj.ortho_mongo2json())
    return taskLog
