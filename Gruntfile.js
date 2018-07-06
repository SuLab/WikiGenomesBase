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

        ngAnnotate : {
            options: {
                singleQuotes: true,
            },
            dist : {
                files : [
                    {
                        expand : true,
                        src : [ 'wiki/static/wiki/js/app/*.js', 'wiki/static/wiki/js/app/**/*.js' ],
                        dest : 'wiki/static/build',
                        rename : function(dest, src) {
                            return dest + '/' + src.replace('wiki/static/wiki/', '').replace('.js', '.annotated.js');
                        }
                    }
                ]
            }
        },

        uglify : {
            dist : {
                files : [ {
                    expand : true,
                    src : [ 'wiki/static/build/js/app/*.js', 'wiki/static/build/js/app/**/*.js' ],
                    dest : 'wiki/static/build',
                    rename : function(dest, src) {
                        return dest + '/' + src.replace('wiki/static/build/', '').replace('.annotated.js', '.min.js');
                    }
                } ],
                options : {
                    mangle : true
                }
            },
            dist2 : {
                files : [ {
                    expand : true,
                    src : [ 'wiki/static/wiki/js/app/*.js', 'wiki/static/wiki/js/app/**/*.js' ],
                    dest : 'wiki/static/build',
                    rename : function(dest, src) {
                        return dest + '/' + src.replace('wiki/static/wiki/', '').replace('.js', '.min.js');
                    }
                } ],
                options : {
                    mangle : false
                }
            }
        },

        clean : {
            dist : {
                expand : true,
                src : [ 'wiki/static/build/js' ]
            },
            dist2: {
                expand : true,
                src : [ 
                	'wiki/static/build/js/app/app.module.min.js', 
                	'wiki/static/build/js/app/app.config.min.js',
                	'wiki/static/build/js/app/filters/filters-service.module.min.js', 
                	'wiki/static/build/js/app/filters/filters-service.filters.min.js',
                	'wiki/static/build/js/app/resources/resources.module.min.js', 
                	'wiki/static/build/js/app/resources/resources.service.min.js'
                	]
            },
            dist3 : {
                expand : true,
                src : [ 'wiki/static/build/js/**/*.annotated.js' ]
            },
            dist4: {
            	expand : true,
                src : [ 'wiki/static/build/app.min.js' ]
            }
        },

        htmlmin: {
        	options: {
        		removeComments: true,
        		collapseWhitespace: true,
        		collapseInlineTagWhitespace: true,
        		minifyCSS: true,
        		removeEmptyAttributes: true
        	},
        	dist: {
        		files: [ {
        			expand: true,
                    src : [ 'wiki/static/wiki/js/angular_templates/*.html' ],
                    dest : 'wiki/static/build',
                    rename : function(dest, src) {
                        return dest + '/' + src.replace('wiki/static/wiki/', '').replace('.html', '.min.html');
                    }
        		}]
        	}
        },

        concat : {
            options : {
                separator : ''
            },
            dist : {
                src : [ 
                	'wiki/static/build/js/app/app.module.min.js', 
                	'wiki/static/build/js/app/app.config.min.js',
                	'wiki/static/build/js/app/filters/filters-service.module.min.js', 
                	'wiki/static/build/js/app/filters/filters-service.filters.min.js',
                	'wiki/static/build/js/app/resources/resources.module.min.js', 
                	'wiki/static/build/js/app/resources/resources.service.min.js'
                	],
                dest : 'wiki/static/build/app.min.js'
            },
            dist2 : {
                src : [ 
                	'wiki/static/build/app.min.js', 
                	'wiki/static/build/js/app/**/*.module.min.js',
                	'wiki/static/build/js/app/**/*.component.min.js'
                	],
                dest : 'wiki/static/build/app.min.js'
            }
        }

    });

    // Load tasks here
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // register tasks here
    // first check for errors, then do dependency injection, then minify, then remove annotation files
    //grunt.registerTask('minify', [ 'jshint', 'clean:dist2', 'uglify:dist2']);
    grunt.registerTask('minify', [ 'jshint', 'clean:dist4', 'ngAnnotate:dist', 'uglify:dist', 'clean:dist3', 'concat:dist', 'clean:dist2', 'concat:dist2', 'clean:dist', 'htmlmin:dist']);

};