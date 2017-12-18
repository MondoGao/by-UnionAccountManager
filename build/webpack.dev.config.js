const webpack = require('webpack');
const { smart } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const baseConfig = require('./webpack.base.config');

const { apiPublicPath, publicPath, port } = require('../settings');

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
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /^((?!\.global).)*\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              camelCase: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),

    new BundleAnalyzerPlugin({
      analyzerPort: port + 1,
      openAnalyzer: false,
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
      [apiPublicPath]: {
        target: 'https://user-dev.hustonline.net',
        changeOrigin: true,
      },
    },
  },
});

