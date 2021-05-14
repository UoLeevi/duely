const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const package = require('./package.json');

externals = Object.keys(package.peerDependencies ?? {});

const alias = {
  '~': path.resolve(__dirname, 'src')
};
Object.keys(package.dependencies ?? {}).map(
  (dep) => (alias[dep] = path.resolve(`./node_modules/${dep}`))
);

let mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  devtool: 'source-map',
  devServer: {
    hot: true,
    inline: true,
    contentBase: path.resolve(__dirname, 'assets'),
    writeToDisk: true,
    historyApiFallback: true
  },
  entry: './src/index.tsx',
  externals,
  mode,
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/i,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode)
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    alias
  },
  output: {
    publicPath: '/',
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  }
};
