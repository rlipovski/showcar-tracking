module.exports = function (grunt) {

    grunt.initConfig({
        karma: {
            options: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS', 'Chrome', 'IE9', 'Firefox']
            },
            dist: {
                singleRun: true,
                reporters: 'progress'
            },
            teamcity: {
                singleRun: true,
                reporters: 'teamcity'
            },
            dev: {
                reporters: 'spec',
                browsers: ['PhantomJS']
            }
        },

        eslint: {
            src: ['src/**/*.js'],
            //tests: ['test/**/*.js']
        }
    });

    grunt.registerTask('test', ['eslint', 'karma:dist']);
    grunt.registerTask('build', ['eslint', 'karma:dist']);
    grunt.registerTask('teamcity-build', ['eslint', 'karma:teamcity']);
    grunt.registerTask('dev', ['karma:dev']);
    grunt.registerTask('default', 'build');

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};