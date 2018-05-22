module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        // configure tasks
        jshint : {
            options : {
                globals : {
                    "angular" : true
                }
            },

            all : [ 'Gruntfile.js', 'wiki/static/wiki/js/app/*.js', 'wiki/static/wiki/js/app/**/*.js' ]
        },

        html2js : {
            dist : {
                src : [ 'wiki/static/wiki/js/angular_templates/*.html' ],
                dest : 'tmp/templates.js'
            }
        },

        concat : {
            options : {
                separator : ';'
            },
            dist : {
                src : [ 'wiki/static/wiki/js/app/*.js', 'wiki/static/wiki/js/app/**/*.js' ],
                dest : 'wiki/static/build/app.js'
            }
        },

        uglify : {
            dist : {
                files : {
                    'wiki/static/build/app.js' : [ 'wiki/static/build/app.js' ]
                },
                options : {
                    mangle : false
                }
            }
        },

        clean : {
            temp : {
                src : [ 'tmp' ]
            }
        }
    });

    // Load tasks here
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');

    // register tasks here
    grunt.registerTask('minify', [ 'jshint', 'html2js:dist', 'concat:dist', 'uglify:dist',
        'clean:temp' ]);

};