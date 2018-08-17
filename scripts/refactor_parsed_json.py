import json

myxopath = "dzf1"
ext = ".json"

with open(myxopath + ext, "r") as file:
    myxodb = json.load(file)

map = {
    "+": 1,
    "-": -1
}

taxid = 0

newdb = []

for gene in myxodb:

    if isinstance(gene, str):
        taxid = int(gene)
        continue

    embl = ""
    if 'embl' in gene.keys():
        embl = gene['embl']
    ensembl = ""
    if 'ensembl' in gene.keys():
        ensembl = gene['ensembl']

    refseq = ""
    uniprot = ""
    name = gene['name']
    type = "gene"
    if 'protein' in gene.keys():
        type = "protein-coding"
        name = gene['protein']['product']
        refseq = gene['protein']['refseq']
        if 'uniprot' in gene.keys():
            uniprot = gene['uniprot']

    entrez = ''
    if 'deprecated_entrez_id' in gene.keys():
        entrez = gene['deprecated_entrez_id']

    symbol = ""
    if "symbol" in gene.keys():
        symbol = gene["symbol"]

    template = {
        'accession': {
            'genomic': [embl, gene['chromosome']],
            'protein': [ensembl, refseq, uniprot]
        },
        'entrezgene': entrez,
        'genomic_pos': {
            'chr': gene['chromosome'],
            'end': int(gene['end']),
            'start': int(gene['start']),
            'entrezgene': entrez,
            'strand': map[gene['strand']]
        },
        'locus_tag': gene['locus_tag'],
        'name': name,
        'pir': '',
        'refseq': {
            'genomic': gene['chromosome'],
            'protein': refseq
        },
        "symbol": symbol,
        "taxid": taxid,
        "type_of_gene": type,
        "uniprot": {
            "Swiss-Prot": uniprot
        }
    }

    newdb.append(template)

metadata = {
    "build_version": 20180809,
    "src_version": {
        "ensembl": 20180809,
        "entrez": 20180809,
        "refseq": 20180809,
        "uniprot": 20180809
    }
}

key_sources = {
    "SGD": "entrez",
    "HGNC": "entrez",
    "MIM": "entrez",
    "FLYBASE": "entrez",
    "WormBase": "entrez",
    "ZFIN": "entrez",
    "RGD": "entrez",
    "MGI": "entrez",
    "exons": "ucsc",
    "ensembl": "ensembl",
    "entrezgene": "entrez",
    "genomic_pos": "refseq",
    "genomic_pos_hg19": "",
    "locus_tag": "refseq",
    "name": "refseq",
    "symbol": "refseq",
    "taxid": "refseq",
    "type_of_gene": "refseq",
    "refseq": "refseq",
    "uniprot": "uniprot",
    "homologene": "entrez",
    "other_names": "entrez",
    "alias": "refseq",
    "map_location": "entrez"
}

with open(myxopath + "_parsed" + ext, "w") as file:
    json.dump([newdb, metadata, key_sources], file)
