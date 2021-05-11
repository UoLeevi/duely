const path = require('path');

let mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  mode,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'index.js',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    library: '@duely/core',
    libraryTarget: 'umd'
  }
}
