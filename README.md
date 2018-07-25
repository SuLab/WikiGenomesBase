# ChlamBase.org
Genomic data portal to [Wikidata.org](www.wikidata.org) built specifically for the chlamydial research community

[ChlamBase.org](http://chlambase.org), a fork of [WikiGenomes.org](http://wikigenomes.org), is an open source and 
user-curated database of functional annotations for 3 model *Chlamydia* species: *C. trachomatis 434/BU* ( LGV L2 ),
*C. trachomatis D/UW-3/CX*, and *C. muridarum Nigg*. A primary goal of this portal is to provide a powerful user-oriented 
experience tailored to the research interests of the *Chlamydia* research community, and to the unique biology of *Chlamydia*.

A central feature of ChlamBase is to allow users to view, add, and edit:
*evidence-based gene annotations 
*engineered mutant strains 
*orthologous gene comparisons
*developmental gene expression
*host interaction targets


Instructions to create a model organism database for the microbes of your choice, go to the [wikigenomes_base](https://github.com/SuLab/wikigenomes_base)
repository and follow the build instructions.

# Developer Note
Need to install grunt in order to rebuild code
Install NPM
npm install grunt-cli -g
From chlambase directory, npm install
Then, do "grunt minify" to minify and rebuild classes

Also need to run ./setup in the JBROWSE directory
(Does not work on windows)