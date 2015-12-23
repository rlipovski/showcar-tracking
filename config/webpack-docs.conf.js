module.exports = {
    entry: "./docs/src/main.js",
    output: {filename: "./docs/main.js"},
    module: {
        loaders: [{test: /\.js$/, loader: "babel?presets[]=es2015"}]
    },
    devtool: "source-map",
    cache: true
};
