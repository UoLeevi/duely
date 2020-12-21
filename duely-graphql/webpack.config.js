const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  target: 'node',
  entry: './src/index.ts',
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
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
    path: path.resolve(__dirname, 'dist')
  }
}
