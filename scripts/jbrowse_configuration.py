import urllib.request
import csv
import codecs
from pymongo import MongoClient
import gzip
import tempfile
from time import gmtime, strftime
import subprocess
import pprint
from scripts.WD_Utils import WDSparqlQueries
from wikigenomes.settings import BASE_DIR
import json

__author__ = 'timputman'


class GenomeDataRetrieval(object):
    """
    Performs a variety of operations for retrieving and configuring genome data for JBrowse to run
    """

    def __init__(self, taxid):
        self.client = MongoClient()
        self.genomes = self.client.genomes
        self.genes = self.genomes.genes
        self.assembly_summary_collection = self.genomes.assembly_summary
        self.taxid = taxid
        self.dirpath = BASE_DIR + '/wiki/static/wiki/js/JBrowse-1.12.1/sparql_data/sparql_data_{}/'.format(self.taxid)

    def get_assembly_summary(self):
        """
        Hits ncbi ftp server to get the assembly_summary.txt file.  Returns entries for chlamydia reference and
        representative genomes
        :return: mongoDB collection 'genomes.assembly_summary' is updated with chlamydia entries
        """

        url = 'ftp://ftp.ncbi.nlm.nih.gov/genomes/refseq/bacteria/assembly_summary.txt'
        ftpstream = urllib.request.urlopen(url)
        csvfile = csv.reader(codecs.iterdecode(ftpstream, 'utf-8'), delimiter="\t")  # with the appropriate encoding
        next(csvfile, None)
        columns = next(csvfile)
        columns[0] = columns[0][2:]
        columns[5] = '_id'
        updatedLog = []
        refseq_cat = [
            'representative genome',
            'reference genome'
        ]
        for row in csvfile:
            if row[5] == self.taxid and row[4] in refseq_cat:
                zipped = dict(zip(columns, row))
                zipped['timestamp'] = strftime("%Y-%m-%d %H:%M:%S", gmtime())
                result = self.assembly_summary_collection.update({'_id': row[5]}, zipped, True)
                result['_id'] = row[5]
                updatedLog.append(result)
        return updatedLog

    def generate_tracklist(self):
        """
        generates the jbrowse data folder trackList.json file for each genome using taxid as primary key
        :return:
        """
        filename = 'trackList.json'
        filepath = self.dirpath + filename

        geneTrack = {
            "type": "JBrowse/View/Track/CanvasFeatures",
            "style": {
                "color": "#99c2ff"
            },
            "label": "genes_canvas_mod",
            "storeClass": "JBrowse/Store/SeqFeature/GFF3",
            "urlTemplate": "{}_genes.gff".format(self.taxid),
            "key": "genes_canvas_mod"
        }

        mutantTrack = {
            "type": "JBrowse/View/Track/CanvasFeatures",
            "style": {
                "color": "red"
            },
            "label": "mutants_canvas_mod",
            "storeClass": "JBrowse/Store/SeqFeature/GFF3",
            "urlTemplate": "{}_mutants.gff".format(self.taxid), # name of mutant gff file
            "key": "mutants_canvas_mod"
        }

        operonTrack = {
            "type": "JBrowse/View/Track/CanvasFeatures",
            "style": {
                "color": "#385d94"
            },
            "label": "operons_canvas_mod",
            "storeClass": "JBrowse/Store/SeqFeature/GFF3",
            "urlTemplate": "{}_operons.gff".format(self.taxid), # name of mutant gff file
            "key": "operons_canvas_mod"
        }

        tracList_json = {
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
            json.dump(tracList_json, outFile)

    def generate_reference(self):
        """
        gets ftp path of genomes sequence and feature data from assembly_summary database and formats for jbrowse
        """
        record = self.assembly_summary_collection.find_one({'_id': self.taxid})
        ftp_path = record['ftp_path']
        file_name = ftp_path.split('/')[-1]
        url = ftp_path + '/' + file_name + '_genomic.fna.gz'
        genome = urllib.request.urlretrieve(url)[0]
        #    return the genome fasta file as a tempfile
        with gzip.open(genome, 'rb') as f:
            current_fasta = f.read()
            with tempfile.NamedTemporaryFile() as temp:
                temp.write(current_fasta)
                temp.flush()
                prep_rs = BASE_DIR + '/wiki/static/wiki/js/JBrowse-1.12.1/bin/prepare-refseqs.pl'
                out_file = BASE_DIR + '/wiki/static/wiki/js/JBrowse-1.12.1/sparql_data/sparql_data_{}'.format(self.taxid)
                sub_args = [prep_rs, "--fasta", temp.name, "--out", out_file]
                subprocess.call(sub_args)


class FeatureDataRetrieval(object):
    def __init__(self, taxid):
        self.client = MongoClient()
        self.genomes = self.client.genomes
        self.genes = self.genomes.genes
        self.operons = self.genomes.operons
        self.mutants = self.genomes.mutants
        self.taxid = taxid
        self.dirpath = BASE_DIR + '/wiki/static/wiki/js/JBrowse-1.12.1/sparql_data/sparql_data_{}/'.format(self.taxid)

    def get_wd_genes(self):
        replaceLog = []
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
            deletion_result = self.genes.delete_many({"taxid": self.taxid})
            result = self.genes.insert_many(tidGeneList)
            replaceLog.append("replaced " + str(len(result.inserted_ids)) + " genes from taxid: " + self.taxid)
        except Exception as e:
            replaceLog.append((e, self.taxid))
        return replaceLog

    def get_wd_operons(self):
        replaceLog = []
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
            deletion_result = self.operons.delete_many({"taxid": self.taxid})
            result = self.operons.insert_many(tidOperonsList)
            replaceLog.append("replaced " + str(len(result.inserted_ids)) + " operons from taxid: " + self.taxid)
        except Exception as e:
            replaceLog.append((e, self.taxid))
        return replaceLog

    def get_mutants(self):
        updatedLog = []
        mutFile = self.dirpath + 'kokes.gff' # eventually this will be a sparql query to wikidata
        header = ['refSeq', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes']
        mutDataList = []
        with open(mutFile, 'r') as mutantFile:
            csvfile = csv.reader(mutantFile, delimiter="\t")
            for row in csvfile:
                row[8] = row[8].lstrip('id=')
                zipped = dict(zip(header, row))
                zipped['taxid'] = self.taxid
                zipped['timestamp'] = strftime("%Y-%m-%d %H:%M:%S", gmtime())
                mutDataList.append(zipped)
        self.mutants.remove()
        self.mutants.insert_many(mutDataList)

    def mutants2gff(self):
        filename = '{}_mutants.gff'.format(self.taxid)
        filepath = self.dirpath + filename
        with open(filepath, 'w', newline='') as csvfile:
            featurewriter = csv.writer(csvfile, delimiter='\t')
            # genewriter.writerow(['seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes'])
            cursor = self.mutants.find({'taxid': self.taxid})
            for doc in cursor:
                featurewriter.writerow(
                    [
                        doc['gff']['seqname'],
                        doc['gff']['source'],
                        doc['gff']['feature'],
                        doc['gff']['start'],
                        doc['gff']['end'],
                        doc['gff']['score'],
                        doc['gff']['strand'],
                        doc['gff']['phase'],
                        doc['gff']['attribute'],
                     ]

                )

    def genes2gff(self):
        filename = '{}_genes.gff'.format(self.taxid)
        filepath = self.dirpath + filename
        with open(filepath, 'w', newline='') as csvfile:
            featurewriter = csv.writer(csvfile, delimiter='\t')
            # genewriter.writerow(['seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes'])
            cursor = self.genes.find({'taxid': self.taxid})
            for doc in cursor:
                featurewriter.writerow(
                    [doc['refSeq'], 'NCBI Gene', 'Gene', doc['start'], doc['end'], '.', doc['strand'],
                     '.', 'id={}'.format(doc['locusTag'])])

    def operons2gff(self):
        filename = '{}_operons.gff'.format(self.taxid)
        filepath = self.dirpath + filename
        with open(filepath, 'w', newline='') as csvfile:
            featurewriter = csv.writer(csvfile, delimiter='\t')
            # genewriter.writerow(['seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes'])
            cursor = self.operons.find({'taxid': self.taxid})
            for doc in cursor:
                featurewriter.writerow(
                    [doc['refSeq'], 'PubMed', 'Operon', doc['start'], doc['end'], '.', doc['strand'],
                     '.', 'id={}'.format(doc['label'])])




