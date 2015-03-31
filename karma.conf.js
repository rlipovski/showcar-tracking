module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        files: [
            'test/**/*.js',
            { pattern: 'src/**/*.js', watched: true, included: false, served: true }
        ],
        reporters: ['progress'],
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],

        preprocessors: {
            'test/**/*.js': ['webpack'],
            './index.js': ['webpack'],
            'src/**/*.js': ['webpack']
        },

        webpack: {
            devtool: 'inline-source-map',
            stats: false,
            debug: false,
            profile: false,
            progress: false
        },

        plugins: [
            'karma-webpack',
            'karma-mocha',
            'karma-chai',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-ie-launcher',
            'karma-spec-reporter',
            'karma-teamcity-reporter'
        ],

        customLaunchers: {
            IE9: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE9'
            }
        }
    });
};