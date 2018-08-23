const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

// const extractPlugin = new ExtractTextPlugin({
//     filename: './assets/css/app.css'
// });

const config = {

    context: path.resolve(__dirname, 'src'),

    entry: {
        app: './app.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './assets/js/[name].bundle.js'
    },

    module: {
        rules: [
            // babel-loader
            {
                test: /\.js$/,
                include: /src/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['es2017']
                    }
                }
            },
            // html-loader
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            // css-loader
            {
                test: /\.css$/,
                include: /src/,
                exclude: /node_modules/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader"
                ]
            },
            // less-loader
            {
                test: /\.less$/,
                include: [path.resolve(__dirname, 'src', 'assets', 'less')],
                use: ExtractTextPlugin.extract({
                    use: [{
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        // {
                        //     loader: 'url-loader'
                        // }
                    ],
                    fallback: 'style-loader'
                })
            },
            // file-loader(for images)
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './assets/media/'
                    }
                }]
            },
            // file-loader(for fonts)
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }

        ]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new ExtractTextPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "assets/css/[name].css",
        })
    ],

    devServer: {
        contentBase: path.resolve(__dirname, "./dist/assets/media"),
        compress: true,
        port: 8081,
        stats: 'errors-only',
        open: true
    },

    devtool: 'inline-source-map'

}

module.exports = config;