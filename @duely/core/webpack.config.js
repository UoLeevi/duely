const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
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
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: '@duely/core',
    libraryTarget: 'umd'
  }
}
