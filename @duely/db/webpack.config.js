const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  target: 'node',
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },
  plugins: [
    // see: https://github.com/brianc/node-postgres/issues/838
    new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'index.js',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    library: '@duely/db',
    libraryTarget: 'umd'
  }
}
