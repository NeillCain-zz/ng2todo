var helpers = require('./helpers');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['', '.ts', '.js'],
        root: helpers.root('app'),
    },

    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            exclude: [/\.e2e\.ts$/]
        }, {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=images/[name].[ext]'
            }, {
                test: /\.css$/,
                exclude: helpers.root('app'),
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            }, {
                test: /\.(html|css)$/,
                include: helpers.root('global_styles', 'app'),
                loader: 'raw-loader'
            }]
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ]
}