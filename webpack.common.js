const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/js/index.tsx',
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      },
      {
        test: /\.(ts|tsx|glsl)$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              emitErrors: true,
              tsConfigFile: 'tsconfig.json',
              typeCheck: true
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.(tiff?)$/,
        exclude: /node_modules/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: 'src/assets', to: '.' }]),
    new MiniCssExtractPlugin('styles.css'),
    new HtmlWebpackPlugin({
      title: 'Iceland Vegetation',
      meta: {
        'og:url': 'https://iceland.visualperspective.io/',
        'og:title': 'Iceland Vegetation',
        'og:description': 'Visualize Iceland\'s vegetation over time.',
        'og:site_name': 'Iceland Vegetation',
        'og:image': 'https://iceland.visualperspective.io/img/iceland_ndvi.png'
      }
    })
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json', '.glsl.ts'],
    alias: {
      '@app': path.resolve(__dirname, 'src/js/'),
      '@scss': path.resolve(__dirname, 'src/scss/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
    }
  },
  node: {
    fs: 'empty'
  }
};
