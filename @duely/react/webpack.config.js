const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  externals: ['react', 'react-dom', 'react-hook-form', 'react-router-dom'],
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')]
      },
      {
        test: /\.css$/,
        use: 'css-loader',
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx']
  },
  output: {
    filename: 'duely-react.js',
    path: path.resolve(__dirname, 'dist'),
    library: '@duely/react',
    libraryTarget: 'umd'
  }
}
