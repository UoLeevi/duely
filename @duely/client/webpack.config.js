const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  externals: ['react', '@apollo/client'],
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
    filename: 'duely-client.js',
    path: path.resolve(__dirname, 'dist'),
    library: '@duely/client',
    libraryTarget: 'umd'
  }
}
