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
    "abbreviated": "Chlam",
    "assets": "cb",
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
            "description": "The LGV strains of CT are associated with aggressive genital tract disease that can disseminate to lymph nodes. The epidemiologic and pathologic differences between these strains and the classical urogenital strains are significant, but the genomic distinctions responsible for these differences are not clear.  This strain is a common model organism used by many to study chlamydial infection in vitro and in vivo.",
            "taxid": "471472"
        },
        {
            "title": "Chlamydia trachomatis D/UW-3CX",
            "description": "The strain represents the classical urogenital strains that are the most common reportable infection in the United States. Its genome is very similar to the LGV strains and to a lesser extent, cm, but there remains a poor level of understanding of the differences in pathogenesis by these organisms.",
            "taxid": "272561"
        }
    ],
    [
        {
            "title": "Chlamydia muridarum Nigg",
            "description": "CM is a murine pathogen that can infect most mucosal surfaces in the mouse. Because it is genetically quite similar to CT, it is often used as a model of human CT infection. There is only a minimal understanding of the molecular basis of tropism differences in these otherwise highly related species. The genomes of these chlamydiae are highly syntenous except for a large region termed the plasticity zone.",
            "taxid": "243161"
        },
        {
            "title": "Chlamydia pneumoniae CWL029",
            "description": "Cpn is a pathogen that infects humans and a variety of other animal species. In humans, this organism causes a walking pneumonia, and has been linked to chronic diseases such as hardening of the arteries and neurologic problems. Some of these connections remain controversial. This pathogen represents a taxonomic lineage within the chlamydia that is different than c. trachomatis and C. Mur. Many of the fundamental properties of chlamydia are shared among these pathogens, but the genetic distinctions associated with the different diseases remain to be worked out.",
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