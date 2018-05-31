const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/js/index.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      },
      {
        test: /\.tsx?$/,
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
        test: /\.(glsl|frag|vert)$/,
        exclude: /node_modules/,
        loader: 'shader-loader',
        options: {
          glsl: {
            chunkPath: path.resolve("./src/js/gl/shaders/functions")
          }
        }
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
    new HtmlWebpackPlugin()
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json', '.glsl'],
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
