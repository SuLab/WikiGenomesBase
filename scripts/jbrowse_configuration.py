import urllib.request
import csv
import codecs
from pymongo import MongoClient
import gzip
import tempfile
from time import gmtime, strftime
import subprocess
from pprint import pprint
from scripts.WD_Utils import WDSparqlQueries
from wikigenomes.settings import BASE_DIR
import json
from application_settings import mongo_database

__author__ = 'Tim Putman and Derek Jow'


class GenomeDataRetrieval(object):
    """
    Performs a variety of operations for retrieving and configuring genome data for JBrowse
    """

    def __init__(self, taxid):
        self.taxid = taxid
        self.dirpath = BASE_DIR + '/wiki/static/wiki/js/external_js/JBrowse-1.14.1/{}_data/'.format(self.taxid)

    def generate_reference_sequence(self):
        """
        generate_reference_sequence()
            Hits ncbi ftp server to get the assembly_summary.txt file.  Then, entries are
            filtered by taxid. Then, the genome file is extracted from the ftp site using
            the ftp path. Finally, full genome sequence is temporarily saved and
            loaded into JBrowse
        :return:
        """

        url = 'https://ftp.ncbi.nlm.nih.gov/genomes/refseq/bacteria/assembly_summary.txt'
        ftpstream = urllib.request.urlopen(url)
        csvfile = csv.reader(codecs.iterdecode(ftpstream, 'utf-8'), delimiter="\t")  # with the appropriate encoding
        next(csvfile, None)
        columns = next(csvfile)
        columns[0] = columns[0][2:]
        columns[5] = '_id'
        refseq_cat = [
            'representative genome',
            'reference genome'
        ]
        for row in csvfile:
            # row[5] = taxid, row[4] = refseq_category
            if row[5] == self.taxid and row[4] in refseq_cat:
            
                # row[19] = ftp_path
                ftp_path = row[19]
                file_name = ftp_path.split('/')[-1]
                url = ftp_path + '/' + file_name + '_genomic.fna.gz'
                genome = urllib.request.urlretrieve(url)[0]
                #    return the genome fasta file as a tempfile
                with gzip.open(genome, 'rb') as f:
                    current_fasta = f.read()
                    with tempfile.NamedTemporaryFile() as temp:
                        temp.write(current_fasta)
                        temp.flush()
                        prep_rs = BASE_DIR + '/wiki/static/wiki/js/external_js/JBrowse-1.14.1/bin/prepare-refseqs.pl'
                        sub_args = [prep_rs, "--fasta", temp.name, "--out", self.dirpath]
                        subprocess.call(sub_args)

    def generate_tracklist(self):
        """
        generate_tracklist()
            generates the jbrowse trackList.json file for each jbrowse genome that
            displays annotations in the jbrowse window
            
            generates the tracklist for genes, mutants, and operons,
            but NOT the data itself
        :return:
        """
        filepath = self.dirpath + "trackList.json"

        geneTrack = {
            "type": "JBrowse/View/Track/CanvasFeatures",
            "style": {
                "color": "#99c2ff"
            },
            "label": "genes_canvas_mod",
            "storeClass": "JBrowse/Store/SeqFeature/GFF3",
            "urlTemplate": "{}_genes.gff".format(self.taxid),
            "key": "genes_canvas_mod",
            "onClick": {
                "label": "right-click for more options",
                "action": "function( track, feature, div ){var top_url = (window.location != window.parent.location)? document.referrer: document.location.href; var pre_url = top_url.split('/');  var taxid = pre_url[4]; var new_url = ['http:/' , pre_url[2], 'organism', taxid, 'gene', this.feature.data.id].join('/'); return window.parent.location=new_url}"
            },
            "menuTemplate": [
                {
                    "label": "View Details",
                },
                {
                    "label": "Highlight this gene",
                },
                {
                    "label": "load this gene page",
                    "iconClass": "dijitIconDatabase",
                    "action": "function( track, feature, div ){var top_url = (window.location != window.parent.location)? document.referrer: document.location.href; var pre_url = top_url.split('/');  var taxid = pre_url[4]; var new_url = ['http:/' , pre_url[2], 'organism', taxid, 'gene', this.feature.data.id].join('/'); return window.parent.location=new_url}"
                }
            ]

        }

        mutantTrack = {
            "type": "JBrowse/View/Track/CanvasFeatures",
            "style": {
                "color": "red"
            },
            "label": "mutants_canvas_mod",
            "storeClass": "JBrowse/Store/SeqFeature/GFF3",
            "urlTemplate": "{}_mutants.gff".format(self.taxid),  # name of mutant gff file
            "key": "mutants_canvas_mod"
        }

        operonTrack = {
            "type": "JBrowse/View/Track/CanvasFeatures",
            "style": {
                "color": "#385d94"
            },
            "label": "operons_canvas_mod",
            "storeClass": "JBrowse/Store/SeqFeature/GFF3",
            "urlTemplate": "{}_operons.gff".format(self.taxid),  # name of mutant gff file
            "key": "operons_canvas_mod"
        }

        trackList_json = {
            "trackSelector": {
                "type": "Faceted"
            },
            "formatVersion": 1,
            "tracks": [
                {
                    "urlTemplate": "seq/{refseq_dirpath}/{refseq}-",
                    "storeClass": "JBrowse/Store/Sequence/StaticChunked",
                    "key": "Reference sequence",
                    "type": "SequenceTrack",
                    "chunkSize": 20000,
                    "label": "DNA",
                    "category": "Reference sequence"
                },
                mutantTrack,
                geneTrack,
                operonTrack
            ]
        }
        with open(filepath, 'w') as outFile:
            json.dump(trackList_json, outFile)

class FeatureDataRetrieval(object):
    def __init__(self, taxid):
        """
        __init__(taxid)
        :param taxid: the NCBI taxid of strain or organism for data retrieval
        """
        self.taxid = taxid
        self.dirpath = BASE_DIR + '/wiki/static/wiki/js/external_js/JBrowse-1.14.1/{}_data/'.format(self.taxid)

    def get_wd_genes(self):
        """
        get_wd_genes()
            Gets a list of wd genes based on a taxid
        :return: list of wikidata genes in a gff-dict notation
        """
        try:
            tidGeneList = []
            queryObj = WDSparqlQueries(taxid=self.taxid)
            tidGenes = queryObj.genes4tid()
            for gene in tidGenes:
                geneObj = {
                    '_id': gene['uniqueID']['value'],
                    'entrez': gene['entrezGeneID']['value'],
                    'start': gene['start']['value'],
                    'end': gene['end']['value'],
                    'strand': gene['strand']['value'],
                    'uri': gene['uri']['value'],
                    'locusTag': gene['name']['value'],
                    'label': gene['description']['value'],
                    'refSeq': gene['refSeq']['value'],
                    'taxid': self.taxid,
                    'timestamp': strftime("%Y-%m-%d %H:%M:%S", gmtime())
                }
                tidGeneList.append(geneObj)
            return tidGeneList
        except Exception as e:
            print(e)
            return []
       
    def genes2gff(self):
        """
        genes2gff()
            Saves the list of genes from the call to get_wd_genes()
            to a gff file in the respective JBrowse folder
            
            Will overwrite the previous gff file
            
            Does not automatically integrate data to JBrowse
        """
        filepath = self.dirpath + '{}_genes.gff'.format(self.taxid)
        with open(filepath, 'w', newline='\n') as csvfile:
            featurewriter = csv.writer(csvfile, delimiter='\t')
            # genewriter.writerow(['seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes'])
            genes = get_wd_genes()
            for gene in genes:
                featurewriter.writerow(
                    [gene['refSeq'], 'NCBI Gene', 'Gene', gene['start'], gene['end'], '.', gene['strand'],
                     '.', 'id={}'.format(gene['locusTag'])])

    def get_wd_operons(self):
        """
        get_wd_operons()
            Gets a list of wd operons based on a taxid
        :return: list of wikidata operons in a gff-dict notation
        """
        try:
            tidOperonsList = []
            queryObj = WDSparqlQueries(taxid=self.taxid)
            tidOperons = queryObj.operons4tid()

            for operon in tidOperons:
                oepronObj = {
                    'start': operon['start']['value'],
                    'end': operon['end']['value'],
                    'strand': operon['strand']['value'],
                    'uri': operon['uri']['value'],
                    'label': operon['description']['value'],
                    'refSeq': operon['refSeq']['value'],
                    'taxid': self.taxid,
                    'timestamp': strftime("%Y-%m-%d %H:%M:%S", gmtime())
                }
                tidOperonsList.append(oepronObj)
            return tidOperonsList
        except Exception as e:
            print(e)
            return []
            
    def operons2gff(self):
        """
        operons2gff()
            Saves the list of operons from the call to get_wd_operons()
            to a gff file in the respective JBrowse folder
            
            Will overwrite the previous gff file
            
            Does not automatically integrate data to JBrowse
        """
        filepath = self.dirpath + '{}_operons.gff'.format(self.taxid)
        with open(filepath, 'w', newline='\n') as csvfile:
            featurewriter = csv.writer(csvfile, delimiter='\t')
            operons = get_wd_operons()
            for operon in operons:
                featurewriter.writerow(
                    [operon['refSeq'], 'PubMed', 'Operon', operon['start'], operon['end'], '.', operon['strand'],
                     '.', 'id={}'.format(operon['label'])])

    def get_mutants(self):
        """
        get_wd_mutants()
            Gets a list of mutants stored in the mongo db for this model organism database
        :return: list of mutants exactly as they appear in the mongodb database filtered by taxid
        """
        mutants = MongoClient()[mongo_database].mutants
        mutantList = []
        for doc in mutants.find({'taxid': self.taxid}):
            mutantList.append(doc)
        return mutantList

    def mutants2gff(self):
        """
        mutants2gff()
            Saves the list of genes from the call to get_mutants()
            to a gff file in the respective JBrowse folder
            
            Will overwrite the previous gff file
            
            Does not automatically integrate data to JBrowse
        """
        filepath = self.dirpath + '{}_mutants.gff'.format(self.taxid)
        with open(filepath, 'w', newline='\n') as csvfile:
            featurewriter = csv.writer(csvfile, delimiter='\t')
            mutants = get_mutants()
            for mutant in mutants:
                featurewriter.writerow(
                    [
                        mutant['chromosome'],
                        mutant['mutation_name'],
                        "mutation", # type
                        mutant['coordinate']['start'],
                        mutant['coordinate']['end'],,
                        ".", # score
                        ".", # strand
                        ".", # phase
                        "name=" + mutant['name']
                    ]

                )
