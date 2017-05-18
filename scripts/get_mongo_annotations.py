from pymongo import MongoClient


__author__ = 'timputman'


class GetMongoAnnotations(object):

    def __init__(self):
        """

        :param locus_tag:
        :return:
        """
        self.client = MongoClient()
        self.genomes = self.client.genomes
        self.mutants = self.genomes.mutants
        self.rheaDB = self.client.rheaDB
        self.reactions = self.rheaDB.reactions

    def get_mutants(self, locus_tag):
        return self.mutants.find({'locusTag': locus_tag})

    def get_reactions(self, ec_number):
        return self.reactions.find({'ec_number': ec_number})

