var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    entry: {
        app: './app/boot.ts',
        vendor: './app/vendor.ts'
    },
    resolve: {
        extensions: ['', '.ts', '.js', '.html']
    },

    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            exclude: [/\.(spec|e2e)\.ts$/]
        }, {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            loader: 'file?name=assets/[name].[hash].[ext]'
        }, {
            test: /\.css$/,
            exclude: helpers.root('app'),
            loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
        }, {
            test: /\.(html|css)$/,
            include: helpers.root('global_styles', 'app'),
            loader: 'raw-loader'
        }, ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor']
        }),
        new HtmlWebpackPlugin({
            title: 'Craneware Todo List',
            template: helpers.root('index.html')
        })
    ]
};