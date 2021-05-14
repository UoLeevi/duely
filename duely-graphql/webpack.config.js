const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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
    // see: https://webpack.js.org/plugins/copy-webpack-plugin/
    new CopyPlugin({
      patterns: [{ from: 'src/gmail/templates', to: 'gmail/templates' }]
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx']
  },
  output: {
    filename: 'index.js',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist')
  }
};
