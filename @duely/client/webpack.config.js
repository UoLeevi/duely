const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  externals: ['react', '@apollo/client', '@duely/core'],
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
    library: '@duely/client',
    libraryTarget: 'umd'
  }
}
