const path = require('path');

// {projectPath}\node_modules\webpack\bin
const webpackPath = require.main.path;

const modulesPath = path.resolve(webpackPath, '../../');
const projectPath = path.resolve(modulesPath, '../');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  devServer: {
    hot: true,
    inline: true,
    contentBase: path.resolve(projectPath, 'assets'),
    writeToDisk: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    useLocalIp: true
  },
  entry: path.resolve(projectPath, 'src/index.tsx'),
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        include: [path.resolve(projectPath, 'src')]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(projectPath, 'public/index.html'),
      filename: 'index.html',
      inject: 'body'
    })
  ],
  output: {
    publicPath: '/',
    filename: 'index.js'
  }
});
