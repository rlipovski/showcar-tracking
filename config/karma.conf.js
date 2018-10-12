module.exports = {
    options: {
        configFile: 'karma.conf.js',
        // browsers: ['Chrome', 'IE9', 'Firefox']
        browsers: ['Chrome']
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
        browsers: ['Chrome']
    }
};
