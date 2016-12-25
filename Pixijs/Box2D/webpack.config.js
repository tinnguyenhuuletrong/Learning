var path = require('path');
var webpack = require('webpack');

console.log(process.env.NODE_ENV);

module.exports = {
    entry: './src/Main.js',
    output: {
        path: __dirname,
        filename: "output/bundle.js",
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
    resolve: {
        alias: {
            //config: path.join(__dirname, 'source', 'config', process.env.NODE_ENV || 'development')
        }
    }
};
