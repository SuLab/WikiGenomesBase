from bson.json_util import dumps
import csv
from pymongo import MongoClient
from wikigenomes.settings import BASE_DIR
import json
from time import strftime, gmtime
from pprint import pprint


class Flatfile2Mongo(object):
    """
    Performs a variety of operations for retrieving and configuring flatfile data to mongo instance for standardization in the application
    """

    def __init__(self, fileName=None, fileBytes=None):
        self.client = MongoClient()
        self.genomes = self.client.genomes
        self.orthologues = self.genomes.orthologues
        self.mutants = self.genomes.mutants
        self.filename = fileName
        self.fileBytes = fileBytes
        self.tsvpath = BASE_DIR + '/wiki/static/wiki/tsv/'
        self.jsonpath = BASE_DIR + '/wiki/static/wiki/json/'

    def ortho2mongo(self):
        """
        parse Kevin Hybiske's orthologue table and load to mongo
        :return:
        """
        orthologueList = []
        filepath = self.tsvpath + self.filename
        with open(filepath, 'r') as mutantFile:
            csvfile = csv.reader(mutantFile, delimiter=",")
            next(csvfile, None)
            for row in csvfile:
                row = {
                    '272561': {'depricated': 'None',
                               'current': row[0]},
                    '471472': {'depricated': 'None',
                               'current': row[1]},
                    '243161': {'depricated': row[2],
                               'current': row[3]},
                    'timestamp': strftime("%Y-%m-%d %H:%M:%S", gmtime())

                }
                orthologueList.append(row)
        self.orthologues.remove()
        result = self.orthologues.insert_many(orthologueList)
        return result.inserted_ids

    def ortho_mongo2json(self):
        orthoData = dumps(self.orthologues.find())
        filepath = self.jsonpath + 'orthologs.json'
        with open(filepath, 'w') as outFile:
            print(orthoData, file=outFile)

    def mutant_gff_2_mongo(self):
        lines = self.fileBytes.splitlines()
        reader = csv.reader(lines, delimiter='\t')
        rows = []
        for row in reader:
            rowDict = {
                "seqname": row[0],
                "source": row[1],
                "feature": row[2],
                "start": row[3],
                "end": row[4],
                "score": row[5],
                "strand": row[6],
                "frame": row[7],
                "attribute": row[8]
            }
            rows.append(rowDict)
        inserted = self.mutants.insert_many(rows)
        cursor = self.mutants.find()
        for i in cursor:
            pprint(i)
