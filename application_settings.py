# enter unique db name for your database
mongo_database = "chlamdb"

# used for celery beat scheduler
wg_timezone = 'America/Los_Angeles'

# Taxids of the organisms in the database (used for setup script, routing, jbrowse)
taxids = ['471472', '272561', '243161', '115713']

# which annotations to allow on the gene page
modules = {
    "protein-view": True,
    "ortholog-view": True,
    "alignment-view": True,
    "expression-view": True,
    "function-view": True,
    "localization-view": True,
    "operon-view": True,
    "interpro-view": True,
    "enzyme-view": True,
    "mutant-view": True,
    "protein-interaction-view": True,
    "related-publication-view": True,
    "revision-history-view": True,
    "movie-data-view": False
}

application = {
    "title": "ChlamBase",
    "noun": "Chlamydia",
    "adjective": "Chlamydial",
    "parent_taxid": 810,
    "newsfeed_search_term": "chlamydia trachomatis",
    "newsfeed_recent_days": 10,
    "newsfeed_max_articles": 20,
    "example_locus_tag": "CTL0260",

    # Either locus_tag or entrez
    "primary_identifier": "locus_tag",
    "multiple_chromosomes_display": True
}

tax2NameMap = {
    "471472": "Chlamydia trachomatis 434/BU",
    "272561": "Chlamydia trachomatis D/UW-3/CX",
    "243161": "Chlamydia muridarum Str. Nigg",
    "115713": "Chlamydia pneumoniae CWL209"
}

strains = [
    [
        {
            "title": "Chlamydia trachomatis 434/BU",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "taxid": "471472"
        },
        {
            "title": "Chlamydia trachomatis D/UW-3CX",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "taxid": "272561"
        }
    ],
    [
        {
            "title": "Chlamydia muridarum Nigg",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "taxid": "243161"
        },
        {
            "title": "Chlamydia pneumoniae CWL029",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "taxid": "115713"
        }
    ],
]

# google chart organism tree
orgTree = {
    'data': [
                [{'v': 'Chlamydia', 'f': '<div class="btn btn-default treeNode nohover" ><i>Chlamydia</i></div>'},
                    ''],
                [{
                    'v': 'Chlamydia trachomatis',
                    'f': '<div class="btn btn-default treeNode nohover" ><i>Chlamydia trachomatis</i></div>'
                },
                    'Chlamydia'],
                [{
                    'v': 'Chlamydia muridarum',
                    'f': '<div class="btn btn-default treeNode nohover" ><i>Chlamydia muridarum</i></div>'
                },
                    'Chlamydia'],
                [{
                    'v': 'Chlamydia pneumoniae',
                    'f': '<div class="btn btn-default treeNode nohover" ><i>Chlamydia pneumoniae</i></div>'
                },
                    'Chlamydia'],
                [{
                    'v': 'Chlamydia pneumoniae CWL029',
                    'f': '<div class="btn btn-default treeNode link"><a href="/organism/115713/" ><i>Chlamydia pneumoniae CWL029</i></div>'
                },
                    'Chlamydia pneumoniae'],
                [{
                    'v': 'Chlamydia muridarum Nigg',
                    'f': '<div class="btn btn-default treeNode link"><a href="/organism/243161/" ><i>Chlamydia muridarum Nigg</i></div>'
                },
                    'Chlamydia muridarum'],
                [{
                    'v': 'Chlamydia trachomatis 434/BU',
                    'f': '<div class="btn btn-default treeNode link"><a href="/organism/471472/" ><i>Chlamydia trachomatis 434/BU</i></a></div>'
                },
                    'Chlamydia trachomatis'],
                [{
                    'v': 'Chlamydia trachomatis D/UW-3/CX',
                    'f': '<div class="btn btn-default treeNode link"><a href="/organism/272561/" ><i>Chlamydia trachomatis D/UW-3/CX</i></a></div>'
                },
                    'Chlamydia trachomatis']
            ]
}