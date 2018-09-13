from pymongo import MongoClient
from application_settings import mongo_database

__author__ = 'timputman and derekjow'

class GetMongoAnnotations(object):

    def __init__(self):
        """
        :param locus_tag:
        :return:
        """
        self.client = MongoClient()
        self.db = self.client[mongo_database]
        self.mutants = self.db.mutants

    def get_mutants(self, locus_tag):
        return self.mutants.find({'locusTag': locus_tag})
        
    def get_chemically_induced_mutants(self):
        return self.mutants.find({'mutation_id': "EFO_0000370"})
        
    def get_transposition_mutants(self):
        return self.mutants.find({'mutation_id': "EFO_0004021"})
        
    def get_recombination_mutants(self):
        return self.mutants.find({'mutation_id': "EFO_0004293"})
        
    def get_insertion_mutants(self):
        return self.mutants.find({'mutation_id': "EFO_0004016"})

