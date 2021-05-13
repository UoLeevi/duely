const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const package = require('./package.json');

externals = Object.keys(package.peerDependencies ?? {});

const alias = {};
Object.keys(package.dependencies ?? {}).map(
  (dep) => (alias[dep] = path.resolve(`./node_modules/${dep}`))
);

let mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  devtool: 'source-map',
  devServer: {
    hot: true,
    inline: true,
    contentBase: [path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'public')],
    writeToDisk: true
  },
  entry: './src/index.tsx',
  externals,
  mode,
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
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      inject: 'body'
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    alias
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
};
