module.exports = {
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
};
