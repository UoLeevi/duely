const webpack = require('webpack');
const path = require('path');
const package = require('./package.json');

externals = Object.keys(package.peerDependencies ?? {});

const alias = {};
Object.keys(package.dependencies ?? {}).map(
  (dep) => (alias[dep] = path.resolve(`./node_modules/${dep}`))
);

let mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  target: 'node',
  externals,
  mode,
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode)
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    alias
  },
  output: {
    filename: 'index.js',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    library: package.name,
    libraryTarget: 'umd',
    clean: true
  }
};
