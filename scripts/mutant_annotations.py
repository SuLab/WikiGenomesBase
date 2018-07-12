from pymongo import MongoClient
from time import gmtime, strftime
import datetime

__author__ = 'timputman'
__author__ = 'derekjow'

class MutantMongo(object):

    def __init__(self, mut_json):
        self.final_json = None
        self.mut_json = mut_json
        self.client = MongoClient()
        self.chlamdb = self.client.chlamdb
        self.mutants = self.chlamdb.mutants

        strain_name = self.mut_json['name'].replace(' ', '_')
        strain_id = '%s-%s-%s' % (strain_name, self.mut_json['locusTag'], self.mut_json['coordinate']['start'])

        self.final_json = self.mut_json
        self.final_json['_id'] = strain_id
        self.final_json['date'] = datetime.datetime.utcnow()

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
        print("Deleting Mongo Annotation: " + self.mut_json['_id'])
        try:
            self.mutants.delete_one({'_id': self.mut_json['_id']})
            return {'delete_success': True}

        except Exception as e:
            return {'delete_success': False}

    # currently not used and needs to be rewritten
    def add_gff_from_json(self):
        if self.mut_json['mutant_type']['key'] == 1:
            self.final_json['gff'] = {
                "seqname": self.final_json['chromosome'],
                "source": self.final_json['mutant_type']['alias'],
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



