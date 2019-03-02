/**
 * To change environments on windows
 * set NODE_ENV=production
 * mvn install
 * java -jar target/localevents-0.0.1-SNAPSHOT.jar
 */

var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry:'./src/main/js/index.js',
    devtool: 'sourcemaps',
    cache: false,
    debug: true,
    output: {
        path: path.resolve(__dirname, './src/main/resources/static/built'),
        filename: 'bundle.js',
        publicPath: "/built/"
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                loader: 'babel',
                // Get spread operator working https://github.com/babel/babel-loader/issues/170
                // stage 0 and async await syntax: https://github.com/webpack/webpack/issues/2785
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: ["transform-es2015-destructuring", "transform-object-rest-spread"]
                }

            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css'],
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }
        })
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compressor: {
        //         warnings: false
        //     }
        // })
    ],

    externals: {
        'CustomConfig': JSON.stringify(process.env.NODE_ENV === 'production' ? require('./config.prod.json') : require('./config.dev.json'))
    }
};