// DEPENDENCIES
const path = require('path');
const config = require('./config');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

// CONFIG
module.exports = {
    target : 'web',
    context: path.resolve(__dirname, './source'),
    entry  : {
        index: ['idempotent-babel-polyfill', './scripts/index']
    },
    output : {
        filename: '[name].js',

        path    : path.resolve(__dirname, config.scripts.output)
    },
    module: {
        rules: [{
            test   : /\.js$/,
            exclude: /(bower_components)/,
            use    : {
                loader : 'babel-loader',
                options: {
                    presets       : ['@babel/preset-env'],
                    plugins       : ['@babel/plugin-proposal-object-rest-spread'],
                    cacheDirectory: true
                }
            }
        },{
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        },{
            test   : /\.twig$/,
            exclude: /(node_modules|bower_components)/,
            use    : {
                loader: 'twig-loader'
            }
        }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([
            path.resolve(__dirname, config.scripts.output)
        ]),
        new webpack.ProvidePlugin({
            $     : 'jquery',
            jQuery: 'jquery'
        })
    ],
    resolve: {
        alias: {
            source: path.resolve(__dirname, './source'),
        }
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                sourceMap    : true,
                uglifyOptions: {
                    ecma  : 6,
                    output: {
                        comments: false
                    },
                    comments: false,
                    compress: {
                        warnings    : false,
                        drop_console: true
                    }
                }
            })
        ]
    }
};
