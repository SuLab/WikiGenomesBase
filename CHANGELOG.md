# WikiGenomesBase Changelog

## ChlamBase Beta v1.5
#### (Developer Website https://dev.chlambase.org)
### Upcoming Changes
- Updated JBrowse
-- Setup scripts now properly download and instantiate the JBrowse instance with annotated
	gene, mutant, and operon canvases
--- C. muridarum st. Nigg genome now fixed and also shows both the main chromosome and plasmid
-- Fixed Celery
--- JBrowse will now update the tracks to display updated mutant and operon information when a new
	annotation is submitted
- New Gene Page Header
-- Moved cell visualizer to header
- New Gene Page Dashboard
-- Every module has a checkbox whether or not it is expanded below
- Protein DataBank View
-- Added new view to Gene Product Module
--- Shows complete list of annotated PDB IDs
--- Shows 3 images of the PDB ID structre taken from ebi
--- Shows the references to the pubmed paper cited in the annotation
- Changes to Ortholog Alignment Module
-- Fixed issue with msa viewer header not working (major version didn't work, switched to dev)
-- Added default showing of consensus graph
-- Ability to change color schemes
-- Changed labels to use locus tags and ref seq ids respectively
-- Stylized the buttons
- Changes to Expression Module
-- Added a new section: Developmental Body Enrichment
--- Allows users to annotate the developing bodies in which the proteins are enriched
- Refactor of GO module into two modules
-- Functions Module (Molecular Function, Biological Process)
-- Localizations Module (Cellular Component)
- Operon Module
-- Fixed reading and writing issues to WikiData
-- Now works properly!
- Mutants Module
-- Added Intron Mutagenesis
-- Added Recombination
- Host Pathogen Module -> Protein Interactions
-- Split HP Module into two sections: Host Protein Interactions and Bacterial Interactions
--- Bacterial Protein interactions (intraspecies interactions) will be shown below HP
- Footer
-- Added improved style
-- Added FAQ
-- Refactored the Footer into its own module to allow greater flexibility
- Landing Page
-- Moved search bar up
-- Turned the search bar into an advanced search bar
- Lots of refactoring and code improvements

## Chlambase Official v1.0
#### (Production Website https://chlambase.org)