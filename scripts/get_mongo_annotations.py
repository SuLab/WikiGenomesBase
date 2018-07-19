from pymongo import MongoClient

__author__ = 'timputman'
__author__ = 'derekjow'

class GetMongoAnnotations(object):

    def __init__(self):
        """
        :param locus_tag:
        :return:
        """
        self.client = MongoClient()
        self.chlamdb = self.client.chlamdb
        self.mutants = self.chlamdb.mutants

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

