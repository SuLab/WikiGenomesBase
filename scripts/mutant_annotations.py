from pymongo import MongoClient
import requests
from SPARQLWrapper import SPARQLWrapper, JSON
from pprint import pprint
import csv


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

    def __init__(self, mut_json=None, taxid=None, refseq=None):
        self.final_json = None
        self.mut_json = mut_json
        self.taxid = taxid
        self.refseq = refseq
        self.client = MongoClient()
        self.genomes = self.client.genomes
        self.mutants = self.genomes.mutants
        self.pmids = {}
        self.insert_log = []

    @staticmethod
    def get_pub(pmid):
        url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id={}'.format(pmid)
        r = requests.get(url)
        return r.json()

    def generate_full_json(self):
        strain_name = self.mut_json['mutant_strain'].replace(' ', '_')
        self.final_json = {
            "_id": '%s-%s-%s' % (strain_name, self.mut_json['locus_tag_L2'], self.mut_json['genome_position_L2']),
            "taxid": self.taxid,
            "locusTag": self.mut_json['locus_tag_L2'],
            "name": self.mut_json['mutant_strain'],
            "chromosome": self.refseq,
            "mutant_type": {
                "alias": "chemical mutagenesis",
                "name": "chemically induced mutation",
                "id": "EFO_0000370",
                "key": 1
            },
            "coordinate": {
                "start": self.mut_json['genome_position_L2']
            },
              "ref_base": self.mut_json['ref_base_L2'],
              "variant_base": self.mut_json['variant_base_L2'],
            "variant_type": {
                "alias": self.mut_json['gene_name_L2'],
                "name": MutantMongo.so_map[self.mut_json['snv_type']]["name"],
                "id": MutantMongo.so_map[self.mut_json['snv_type']]["id"]
            },
            "aa_effect": self.mut_json['aa_sub'],
            "pub": self.get_pub(self.mut_json['ref_pmid']),

        }

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
        try:
            self.mutants.delete_one({'_id': self.final_json['_id']})
            return {'delete_success': True}

        except Exception as e:
            return {'delete_success': False}

    def add_gff_from_json(self):
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
