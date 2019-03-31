const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const BUILD_DIR = path.resolve(__dirname, 'public/assets');
const APP_DIR = path.resolve(__dirname, 'src');
const BOWER_DIR = path.resolve(__dirname, 'bower_components');

const plugins = [
  new webpack.EnvironmentPlugin(['NODE_ENV', 'APP_VERSION', 'API_BASE_URL', 'GOOGLE_MAPS_API_KEY']),
  new MiniCssExtractPlugin({filename: 'style.css'}),
  new webpack.LoaderOptionsPlugin({ options: {} })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new UglifyJSPlugin({ sourceMap: true }));
}

const config = {
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: (
      '/assets/'
    ),
  },
  devtool: (
    process.env.NODE_ENV === 'production' ?
      'source-map' : 'inline-source-map'
  ),
  module: {
    rules: [
      {
        test: /\.json$/,
        type: 'javascript/auto',
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'json-loader',
        }],
      },
      {
        test: /\.ejs/,
        use: [
          'ejs-compiled-loader',
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'babel-loader',
        ]
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              minimize: true
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [autoprefixer('last 2 versions', 'ie 10')];
              }
            }
          },
          { loader: "sass-loader" }
        ],
      }
    ],
  },
  resolve: {
    modules: [APP_DIR, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      'jquery':           path.join(BOWER_DIR, '/jquery/dist/jquery.js'),
      'pickadate-picker': path.join(BOWER_DIR, '/pickadate/lib/picker.js'),
      'pickadate-date':   path.join(BOWER_DIR, '/pickadate/lib/picker.date.js'),
      'pickadate-time':   path.join(BOWER_DIR, '/pickadate/lib/picker.time.js'),
      'picker':           path.join(BOWER_DIR, '/pickadate/lib/picker.js'),
      'pickadate-it':     path.join(BOWER_DIR, '/pickadate/lib/translations/it_IT.js'),

      // overwrite this useless package
      'codemirror-spell-checker': path.join(APP_DIR, '/vendor/codemirror-spell-checker/index.js')
    },
  },
  plugins,
  devServer: {
    contentBase: './public',
    port: 3001,
    historyApiFallback: true,
    disableHostCheck: true
  }
};

module.exports = config;
