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
    "related-publication-view": True
}

application = {
    "title": "ChlamBase",
    "noun": "Chlamydia",
    "adjective": "Chlamydial",
    "parent_taxid": 810,
    "newsfeed_search_term": "chlamydia trachomatis"
}

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