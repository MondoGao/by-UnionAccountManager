const webpack = require('webpack');
const { smart } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const baseConfig = require('./webpack.base.config');

const { publicPath, port } = require('../settings');

module.exports = smart(baseConfig, {
  entry: {
    index: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'whatwg-fetch',
      './src/index.js',
    ],
  },
  module: {
    rules: [
      {
        test: /\.global\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              module: true,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              module: true,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),

    new BundleAnalyzerPlugin({
      analyzerPort: port + 1,
      open: false,
    }),
  ],
  devServer: {
    port,
    publicPath,
    hot: true,
    contentBase: './dist',
    host: '0.0.0.0',
    compress: true,
    proxy: {
    },
  },
});

