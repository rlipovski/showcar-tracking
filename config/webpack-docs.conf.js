module.exports = {
    entry: "./docs/src/main.js",
    output: {filename: "./docs/main.js"},
    module: {
        loaders: [{test: /\.js$/, loader: "babel?presets[]=es2015,plugins=babel-plugin-transform-object-assign"}]
    },
    devtool: "source-map",
    cache: true
};
