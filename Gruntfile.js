module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        // configure tasks
        jshint : {
            options : {
                globals : {
                    "angular" : true,
                    "console" : true,
                    "window" : true
                }
            },

            all : [ 'Gruntfile.js', 'wiki/static/wiki/js/app/*.js', 'wiki/static/wiki/js/app/**/*.js' ]
        },

        /*html2js : {
            dist : {
                src : [ 'wiki/static/wiki/js/angular_templates/*.html' ],
                dest : 'tmp/templates.js'
            }
        },*/

        //concat : {
        //    options : {
        //        separator : ';'
        //    },
        //    dist : {
        //        src : [ 'wiki/static/wiki/js/app/*.js', 'wiki/static/wiki/js/app/**/*.js' ],
        //        dest : 'wiki/static/build/app.js'
        //    }
        //},

        uglify : {
            dist : {
                files : {
                    /*
                    'wiki/js/app/app.module.js' : [],
                    'wiki/js/app/app.config.js' : [],

                    'wiki/js/app/filters/filters-service.module.js' : [],
                    'wiki/js/app/filters/filters-service.filters.js' : [],

                    'wiki/js/app/browser-page/browser-page.module.js' : [],
                    'wiki/js/app/browser-page/browser-page.component.js' : [],

                    'wiki/js/app/organism-form/organism-form.module.js' : [],
                    'wiki/js/app/organism-form/organism-form.component.js' : [],

                    'wiki/js/app/gene-form/gene-form.module.js' : [],
                    'wiki/js/app/gene-form/gene-form.component.js' : [],

                    'wiki/js/app/landing-page/landing-page.module.js' : [],
                    'wiki/js/app/landing-page/landing-page.component.js' : [],

                    'wiki/js/app/main-page/mainpage-view.module.js' : [],
                    'wiki/js/app/main-page/mainpage-view.component.js' : [],

                    'wiki/js/app/resources/resources.module.js' : [],
                    'wiki/js/app/resources/resources.service.js' : [],

                    'wiki/js/app/gene-view/gene-view.module.js' : [],
                    'wiki/js/app/gene-view/gene-view.component.js' : [],

                    'wiki/js/app/protein-view/protein-view.module.js' : [],
                    'wiki/js/app/protein-view/protein-view.component.js' : [],

                    'wiki/js/app/organism-view/organism-view.module.js' : [],
                    'wiki/js/app/organism-view/organism-view.component.js' : [],

                    'wiki/js/app/jbrowse-view/jbrowse-view.module.js' : [],
                    'wiki/js/app/jbrowse-view/jbrowse-view.component.js' : [],

                    'wiki/js/app/annotations-view/annotations-view.module.js' : [],
                    'wiki/js/app/annotations-view/annotations-view.component.js' : [],

                    'wiki/js/app/annotations-view/gene-ontology-view/gene-ontology-view.module.js' : [],
                    'wiki/js/app/annotations-view/gene-ontology-view/gene-ontology-view.component.js' : [],

                    'wiki/js/app/annotations-view/interpro-view/interpro-view.module.js' : [],
                    'wiki/js/app/annotations-view/interpro-view/interpro-view.component.js' : [],

                    'wiki/js/app/annotations-view/operon-view/operon-view.module.js' : [],
                    'wiki/js/app/annotations-view/operon-view/operon-view.component.js' : [],

                    'wiki/js/app/annotations-view/operon-view/operon-view.module.js' : [],
                    'wiki/js/app/annotations-view/operon-view/operon-view.component.js' : [],

                    'wiki/js/app/go-form/go-form.module.js' : [],
                    'wiki/js/app/go-form/go-form.component.js' : [],

                    'wiki/js/app/annotations-view/genomic-position/genomic-position.module.js' : [],
                    'wiki/js/app/annotations-view/genomic-position/genomic-position.component.js' : [],

                    'wiki/js/app/annotations-view/enzyme-view/enzyme-view.module.js' : [],
                    'wiki/js/app/annotations-view/enzyme-view/enzyme-view.component.js' : [],

                    'wiki/js/app/all-genes-download/allgenes-download.module.js' : [],
                    'wiki/js/app/all-genes-download/allgenes-download.component.js' : [],

                    'wiki/js/app/operon-form/operon-form.module.js' : [],
                    'wiki/js/app/operon-form/operon-form.component.js' : [],

                    'wiki/js/app/organism-tree/organism-tree.module.js' : [],
                    'wiki/js/app/organism-tree/organism-tree.component.js' : [],

                    'wiki/js/app/authorization/oauth.module.js' : [],
                    'wiki/js/app/authorization/oauth.component.js' : [],

                    'wiki/js/app/genes-keyword-browser/genes-keyword.module.js' : [],
                    'wiki/js/app/genes-keyword-browser/genes-keyword.component.js' : [],

                    'wiki/js/app/keyword-form/keyword-form.module.js' : [],
                    'wiki/js/app/keyword-form/keyword-form.component.js' : [],

                    'wiki/js/app/keyword-paginated/keyword-paginated.module.js' : [],
                    'wiki/js/app/keyword-paginated/keyword-paginated.component.js' : [],

                    'wiki/js/app/annotations-view/mutants-view/mutants-view.module.js' : [],
                    'wiki/js/app/annotations-view/mutants-view/mutants-view.component.js' : [],

                    'wiki/js/app/annotations-view/linked-pubs/linked-pubs.module.js' : [],
                    'wiki/js/app/annotations-view/linked-pubs/linked-pubs.component.js' : [],

                    'wiki/js/app/annotations-view/ortholog-view/ortholog-view.module.js' : [],
                    'wiki/js/app/annotations-view/ortholog-view/ortholog-view.component.js' : [],

                    'wiki/js/app/mutant-forms/mutant-single-form.module.js' : [],
                    'wiki/js/app/mutant-forms/mutant-single-form.component.js' : [],

                    'wiki/js/app/functional-annotation/functional-annotation.module.js' : [],
                    'wiki/js/app/functional-annotation/functional-annotation.component.js' : [],

                    'wiki/js/app/annotations-view/expression-view/expression-view.module.js' : [],
                    'wiki/js/app/annotations-view/expression-view/expression-view.component.js' : [],

                    'wiki/js/app/annotations-view/host-pathogen/host-pathogen.module.js' : [],
                    'wiki/js/app/annotations-view/host-pathogen/host-pathogen.component.js' : [],

                    'wiki/js/app/hostpath-form/hostpath-form.module.js' : [],
                    'wiki/js/app/hostpath-form/hostpath-form.component.js' : [],
                    
                    'wiki/js/app/annotations-view/cell-visualizer-view/cell-visualizer-view.module.js' : [],
                    'wiki/js/app/annotations-view/cell-visualizer-view/cell-visualizer-view.component.js' : [],
                    
                    'wiki/js/app/help-form/help-form.module.js' : [],
                    'wiki/js/app/help-form/help-form.component.js' : []
                    */
                },
                options : {
                    mangle : false
                }
            }
        }

        /*clean : {
            temp : {
                src : [ 'tmp' ]
            }
        }*/
    });

    // Load tasks here
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-html2js');

    // register tasks here
    //grunt.registerTask('minify', [ 'jshint', 'html2js:dist', 'concat:dist', 'uglify:dist', 'clean:temp' ]);
    grunt.registerTask('minify', [ 'jshint', 'uglify:dist']);

};