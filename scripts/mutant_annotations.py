from pymongo import MongoClient
import requests
from time import gmtime, strftime
from SPARQLWrapper import SPARQLWrapper, JSON
from pprint import pprint
import csv

__author__ = 'timputman'


class MutantMongo(object):
    so_map = {
        'SYNONYMOUS': {
            'name': 'synonymous',
            'id': 'SO:0001814'
        },
        'Non-neutral': {
            'name': 'non-synonymous',
            'id': 'SO:0001816'
        },
        'NON-CODING': {
            'name': 'non_transcribed_region',
            'id': 'SO:0000183'
        },
        'Neutral': {
            'name': 'silent_mutation',
            'id': 'SO:0001017'
        },
        'NONSENSE': {
            'name': 'stop_gained',
            'id': 'SO:0001587'
        }
    }

    def __init__(self, mut_json=None, taxid=None, refseq=None):
        self.final_json = None
        self.mut_json = mut_json
        self.taxid = taxid
        self.refseq = refseq
        self.client = MongoClient()
        self.genomes = self.client.genomes
        self.mutants = self.genomes.mutants
        self.tn_mutants = self.genomes.tn_mutants
        self.pmids = {}
        self.insert_log = []

    @staticmethod
    def get_pub(pmid):
        url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id={}'.format(pmid)
        r = requests.get(url)
        return r.json()

    def generate_full_json(self):
        strain_name = self.mut_json['name'].replace(' ', '_')
        strain_id = '%s-%s-%s' % (strain_name, self.mut_json['locusTag'], self.mut_json['coordinate']['start'])

        self.final_json = self.mut_json
        self.final_json['_id'] = strain_id
        self.final_json['retrieved'] = strftime("%Y-%m-%d %H:%M:%S", gmtime())

    def push2mongo(self):
        try:
            self.mutants.insert_one(self.final_json)
            return {
                'write_success': True,
                'duplicate_key': False,
            }
        except Exception as e:
            print(e.args)
            if 'E11000' in e.args:
                return {
                    'write_success': False,
                    'duplicate_key': True,
                }
            else:
                return {
                    'write_success': False,
                    'duplicate_key': False,
                }

    def delete_one_mongo(self):
        print('delete one mongo')
        pprint(self.mut_json['_id'])
        try:
            self.mutants.delete_one({'_id': self.mut_json['_id']})
            return {'delete_success': True}

        except Exception as e:
            return {'delete_success': False}

    def add_gff_from_json(self):
        if self.mut_json['mutant_type']['key'] == 1:
            self.final_json['gff'] = {
                "seqname": self.final_json['chromosome'],
                "source": self.final_json['mutant_type'],
                "feature": 'mutation',
                "start": self.final_json['coordinate']['start'],
                "end": self.final_json['coordinate']['start'],
                "score": '.',
                "strand": '.',
                "phase": '.',
                "attribute": 'id={}'.format(self.final_json['name'])
            }
            print('chem gff', self.final_json['gff'])
        if self.mut_json['mutant_type']['key'] == 2:
            print('add gff trans from json')
            self.final_json['gff'] = {
                "seqname": self.refseq,
                "source": self.final_json['mutant_type']['alias'],
                "feature": 'mutation',
                "start": self.final_json['coordinate']['start'],
                "end": self.final_json['coordinate']['start'],
                "score": '.',
                "strand": '.',
                "phase": '.',
                "attribute": 'id={}'.format(self.final_json['name'])
            }
            print('trans gff', self.final_json['gff'])



