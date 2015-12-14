module.exports = {
    entry: "./src/index.js",
    output: {filename: "./dist/showcar-tracking.js"},
    module: {
        loaders: [{test: /\.js$/, loader: "babel?presets[]=es2015"}]
    },
    devtool: "source-map",
    cache: true
};
