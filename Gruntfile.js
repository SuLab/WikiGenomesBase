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
                src : [ 'wiki/static/build/**/*.annotated.js' ]
            },
            dist2: {
                expand : true,
                src : [ 'wiki/static/build/**/*.min.js' ]
            }
        }

        //html2js : {
        //    dist : {
        //        src : [ 'wiki/static/wiki/js/angular_templates/*.html' ],
        //        dest : 'tmp/templates.js'
        //    }
        //},

        //concat : {
        //    options : {
        //        separator : ';'
        //    },
        //    dist : {
        //        src : [ 'wiki/static/wiki/js/app/*.js', 'wiki/static/wiki/js/app/**/*.js' ],
        //        dest : 'wiki/static/build/app.js'
        //    }
        //},

    });

    // Load tasks here
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');

    //grunt.loadNpmTasks('grunt-html2js');
    //grunt.loadNpmTasks('grunt-contrib-concat');

    // register tasks here
    // first check for errors, then do dependency injection, then minify, then remove annotation files
    //grunt.registerTask('minify', [ 'jshint', 'clean:dist2', 'uglify:dist2']);
    grunt.registerTask('minify', [ 'jshint', 'clean:dist2', 'ngAnnotate:dist', 'uglify:dist', 'clean:dist']);

};