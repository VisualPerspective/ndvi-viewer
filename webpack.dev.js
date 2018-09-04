const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: common.plugins.concat([
    new webpack.DefinePlugin({
      'process.env.NDVI_ATLAS': JSON.stringify('atlas/ndvi.atlas'),
      'process.env.NDVI_ANOMALY_ATLAS': JSON.stringify('atlas/ndvi-anomaly.atlas'),
      'process.env.PROFILE': true,
      'process.env.SITE_URL': JSON.stringify('https://vp-stage.firebaseapp.com'),
    })
  ])
});
