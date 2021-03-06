const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: common.plugins.concat([
    new webpack.DefinePlugin({
      'process.env.NDVI_ATLAS': JSON.stringify('https://storage.googleapis.com/iceland-ndvi/static/ndvi.atlas'),
      'process.env.NDVI_ANOMALY_ATLAS': JSON.stringify('https://storage.googleapis.com/iceland-ndvi/static/ndvi-anomaly.atlas'),
      'process.env.PROFILE': false,
      'process.env.SITE_URL': JSON.stringify('https://visualperspective.io'),
    })
  ])
});
