# enter unique db name for your database
mongo_database = "myxodb"

# used for celery beat scheduler
wg_timezone = 'America/Los_Angeles'

# Taxids of the organisms in the database (used for setup script, routing, jbrowse)
taxids = ['246197', '1198538', '1198133']

# which annotations to allow on the gene page
modules = {
    "protein-view": True,
    "ortholog-view": False,
    "alignment-view": False,
    "expression-view": False,
    "function-view": True,
    "localization-view": True,
    "operon-view": True,
    "interpro-view": True,
    "enzyme-view": True,
    "mutant-view": True,
    "protein-interaction-view": False,
    "related-publication-view": True,
    "revision-history-view": True,
    "movie-data-view": True
}

application = {
    "title": "MyxoBase",
    "noun": "Myxococcus",
    "adjective": "Myxococcal",
    "abbreviated": "Myxo",
    "assets": "mb",
    "parent_taxid": 34,
    "newsfeed_search_term": "myxococcus xanthus",
    "newsfeed_recent_days": 60,
    "newsfeed_max_articles": 20,
    "example_locus_tag": "MXAN_RS00015",
    # Either locus_tag or entrez
    "primary_identifier": "locus_tag",
    "multiple_chromosomes_display": False
}

tax2NameMap = {
    "246197": "Myxococcus xanthus DK 1622",
    "1198538": "Myxococcus xanthus DZF1",
    "1198133": "Myxococcus xanthus DZ2"
}

tax2IconMap = {
    "471472": "strain-434.svg",
    "272561": "strain-DUX.svg",
    "243161": "strain-NIGG.svg",
    "115713": "strain-CW.svg"
}

strains = [
    [
        {
            "title": "Myxococcus xanthus DK 1622",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "taxid": "246197"
        },
        {
            "title": "Myxococcus xanthus DZ2",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "taxid": "1198133"
        }
    ],
    [
        {
            "title": "Myxococcus xanthus DZF1",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "taxid": "1198538"
        },
        {
            "title": "Myxococcus xanthus New Jersey",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "taxid": "115713"
        }
    ],
]

# google chart organism tree
orgTree = {
    'data': [
                [{'v': 'Myxococcus xanthus', 'f': '<div class="btn btn-default bg-dark text-light treeNode nohover" ><i>Myxococcus xanthus</i></div>'},
                    ''],
                [{
                    'v': 'Myxococcus xanthus DK 1622',
                    'f': '<div class="btn btn-default treeNode c434 link" ><a href="/organism/246197/"><i>Myxococcus xanthus DK 1622</i></a></div>'
                },
                    'Myxococcus xanthus'],
                [{
                    'v': 'Myxococcus xanthus DZ2',
                    'f': '<div class="btn btn-default treeNode cDUX link"><a href="/organism/1198133/"><i>Myxococcus xanthus DZ2</i></a></div>'
                },
                    'Myxococcus xanthus'],
                [{
                    'v': 'Myxococcus xanthus DZF1',
                    'f': '<div class="btn btn-default treeNode cNIGG link"><a href="/organism/1198538/"><i>Myxococcus xanthus DZF1</i></a></div>'
                },
                    'Myxococcus xanthus'],
                [{
                    'v': 'Myxococcus xanthus NewJersey2',
                    'f': '<div class="btn btn-default treeNode cCW nohover"><i>Myxococcus xanthus NewJersey2</i></div>'
                },
                    'Myxococcus xanthus']
            ]
}