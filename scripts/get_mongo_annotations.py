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

