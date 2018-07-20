const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: common.plugins.concat([
    new webpack.DefinePlugin({
      'process.env.ATLAS': JSON.stringify('atlas/ndvi.atlas')
    })
  ])
});
