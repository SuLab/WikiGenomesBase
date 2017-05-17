from pymongo import MongoClient


__author__ = 'timputman'


class GetMongoAnnotations(object):

    def __init__(self, locus_tag):
        """

        :param locus_tag:
        :return:
        """
        self.locus_tag = locus_tag
        self.client = MongoClient()
        self.genomes = self.client.genomes
        self.mutants = self.genomes.mutants

    def get_mutants(self):
        return self.mutants.find({'locusTag': self.locus_tag})

