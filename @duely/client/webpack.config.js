const path = require('path');

let mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  externals: ['react', '@apollo/client', '@duely/core'],
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
    path: path.resolve(__dirname, 'dist'),
    library: '@duely/client',
    libraryTarget: 'umd'
  }
}
