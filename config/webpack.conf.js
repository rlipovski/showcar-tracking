module.exports = {
    entry: "./src/index.js",
    output: {filename: "./dist/showcar-tracking.js"},
    module: {
        loaders: [{test: /\.js$/, loader: "babel?presets[]=es2015,plugins=babel-plugin-transform-object-assign"}]
    },
    devtool: "source-map",
    cache: true
};
