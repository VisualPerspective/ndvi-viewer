const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: common.plugins.concat([
    new webpack.DefinePlugin({
      'process.env.ATLAS': JSON.stringify('https://storage.googleapis.com/iceland-ndvi/static/ndvi.atlas'),
      'process.env.PROFILE': false
    })
  ])
});
