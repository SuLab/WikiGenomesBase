# enter unique db name for your database
mongo_database = "fishdb"

# used for celery beat scheduler
wg_timezone = 'America/Los_Angeles'

# Taxids of the organisms in the database (used for setup script, routing, jbrowse)
taxids = ['105023']

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
    "title": "FishBase",
    "noun": "Turqoise Killifish",
    "adjective": "Killifish",
    "parent_taxid": 28779,
    "newsfeed_search_term": "turqoise killifish",
    "newsfeed_recent_days": 10,
    "newsfeed_max_articles": 20,
    "example_locus_tag": "LOC107381016 ",

    # Either locus_tag or entrez
    "primary_identifier": "entrez"
}

tax2NameMap = {
    "105023": "Nothobranchius furzeri"
}

# google chart organism tree
orgTree = {
    'data': [
                [{'v': 'Nothobranchius', 'f': '<div class="btn btn-default treeNode nohover" ><i>Nothobranchius</i></div>'},
                    ''],
                [{
                    'v': 'Nothobranchius furzeri',
                    'f': '<div class="btn btn-default treeNode link"><a href="/organism/105023/" ><i>Nothobranchius furzeri</i></div>'
                },
                    'Nothobranchius'],
            ]
}