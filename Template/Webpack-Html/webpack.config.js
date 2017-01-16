var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

console.log(process.env.NODE_ENV);

module.exports = {
    entry: './src/Main.js',
    output: {
        path: __dirname + "/output",
        filename: "[hash].bundle.js",
        publicPath: "/"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ["es2015"],
                    plugins: ["babel-plugin-syntax-flow", "babel-plugin-transform-flow-strip-types", 'transform-class-properties', 'transform-runtime']
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
          template: 'index.template.ejs',
          inject: 'body',
        })
    ],
    resolve: {
        alias: {
            //config: path.join(__dirname, 'source', 'config', process.env.NODE_ENV || 'development')
        }
    }
};
