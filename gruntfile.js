/* global module: false, grunt: false, process: false */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: [
            'bower_components/**',
            'dist/**',
            'coverage/**'
        ],
        jshint: {
            all: {
                src: ['pie/modules/**/*.js']
            }
        },
        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },
        karma: {
            test: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            watch: {
                configFile: 'karma.conf.js',
                autoWatch: true
            }
        },
        connect: {
            server: {
                options: {
                    port: grunt.option('port') || 8888,
                    base: '.',
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['jshint', 'bower', 'karma:test'], null);
};
