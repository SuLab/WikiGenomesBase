# enter unique db name for your database
mongo_database = "myxodb"

# used for celery beat scheduler
wg_timezone = 'America/Los_Angeles'

# Taxids of the organisms in the database (used for setup script, routing, jbrowse)
taxids = ['246197', '1198538']

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
    "title": "MyxoBase",
    "noun": "Myxococcus",
    "adjective": "Myxococcal",
    "parent_taxid": 34,
    "newsfeed_search_term": "myxococcus xanthus"
}