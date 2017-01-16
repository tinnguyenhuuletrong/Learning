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
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ["es2015", "stage-0"],
                plugins: []
            }
        }, {
            test: /\.glsl$/,
            loader: 'webpack-glsl'
        }, {
            test: /\.html$/,
            loader: 'html-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.png$/,
            loader: 'url-loader?limit=100000'
        }, {
            test: /\.jpg$/,
            loader: 'file-loader'
        }, {
            test: /\.scss$/,
            loader: 'css-loader!sass-loader'
        }]
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

if (process.env.NODE_ENV == "development") {
    module.exports.devtool = 'source-map'
    module.exports.debug = true
}