const webpack = require('webpack');

module.exports = {
    entry: './src/cashstack.js',
    output: { filename: './dist/cashstack.min.js' },
    module: {
        loaders: [{ test: /\.js$/, loader: 'babel?presets[]=es2015,plugins=babel-plugin-transform-object-assign' }],
    },
    devtool: 'source-map',
    cache: true,
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
        }),
    ],
};
