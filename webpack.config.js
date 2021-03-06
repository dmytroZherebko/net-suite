var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ['whatwg-fetch', 'regenerator-runtime/runtime', './client/app.js'],
  output: {
    path: path.resolve(__dirname, './build'),
    publicPath: '',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader?sourceMap',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: path.resolve(__dirname, './postcss.config.js')
                }
              }
            },
            'sass-loader?sourceMap'
          ],
          fallback: 'style-loader'
        }),
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
      inject: 'body'
    }),
    new ExtractTextPlugin("style.css"),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        redirect_uri: JSON.stringify(process.env.redirect_uri),
        client_id: JSON.stringify(process.env.client_id)
      }
    }),
  ],

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    port: 3000,
    allowedHosts: [
      '.ngrok.io'
    ]
  },
  performance: {
    hints: false
  },
  devtool: '#source-map'
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = false;

  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ])
}
