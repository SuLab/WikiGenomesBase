from __future__ import absolute_import, unicode_literals
from wikigenomes.settings import BASE_DIR
from celery import shared_task
from scripts import jbrowse_configuration
from scripts import flatfile_ingestion

import os

chlamydia_taxids = [
    '471472',
    '115713',
    '272561',
    '243161'
]


@shared_task
def get_wd_genome_data():
    """
    gather genomic data and configures genome level feature tracks for jbrowse
    :return:
    """
    taskLog = []
    for taxid in chlamydia_taxids:
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
    for taxid in chlamydia_taxids:
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
