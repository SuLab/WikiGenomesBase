from pymongo import MongoClient
from pprint import pprint
import csv
import requests


__author__ = 'timputman'


class MutantMongo(object):
    so_map = {
        'SYNONYMOUS' : {
            'name': 'synonymous',
            'id': 'SO:0001814'
        },
        'Non-neutral':{
            'name': 'non-synonymous',
            'id': 'SO:0001816'
        },
       'NON-CODING':{
            'name': 'non_transcribed_region',
            'id': 'SO:0000183'
        },
        'Neutral':{
            'name': 'silent_mutation',
            'id': 'SO:0001017'
        },
        'NONSENSE': {
            'name': 'stop_gained',
            'id': 'SO:0001587'
        }
    }

    def __init__(self, mut_json=None):
        """

        :param mut_json:
        :return:
        """
        self.mut_json = mut_json
        self.client = MongoClient()
        self.genomes = self.client.genomes
        self.mutants = self.genomes.mutants
        self.pmids = {}
        self.insert_log = []

        self.mut_json['_id'] = '%s-%s-%s' % (self.mut_json['name'],
                                             self.mut_json['locusTag'],
                                             self.mut_json['coordinate']['start'])

    def push2mongo(self):
        try:
            self.mutants.insert_one(self.mut_json)
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
        try:
            self.mutants.delete_one({'_id': self.mut_json['_id']})
            return {'delete_success': True}

        except Exception as e:
            return {'delete_success': False}

    def add_gff_from_json(self):
        self.mut_json['gff'] = {
            "seqname": self.mut_json['chromosome'],
            "source": self.mut_json['mutant_type'],
            "feature": 'mutation',
            "start": self.mut_json['coordinate']['start'],
            "end": self.mut_json['coordinate']['start'],
            "score": '.',
            "strand": '.',
            "phase": '.',
            "attribute": 'id={}'.format(self.mut_json['name'])
        }

    @staticmethod
    def get_pub(pmid):
        url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id={}'.format(pmid)
        r = requests.get(url)
        return r.json()