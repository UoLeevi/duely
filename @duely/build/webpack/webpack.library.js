const path = require('path');

// {projectPath}\node_modules\webpack\bin
const webpackPath = require.main.path;

const modulesPath = path.resolve(webpackPath, '../../');
const projectPath = path.resolve(modulesPath, '../');
const package = require(path.resolve(projectPath, 'package.json'));
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  devtool: 'source-map',
  entry: path.resolve(projectPath, 'src/index.ts'),
  output: {
    filename: 'index.js',
    globalObject: 'this',
    library: package.name,
    libraryTarget: 'umd'
  }
});
