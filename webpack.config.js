var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'vuex-socketio.min.js',
        library: ['VuexSocketio'],
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            enforce: 'pre',
            loaders: ['babel-loader', 'eslint-loader']
        }]
    }
};
