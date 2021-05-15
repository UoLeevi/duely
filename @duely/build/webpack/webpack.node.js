const path = require('path');

// {projectPath}\node_modules\webpack\bin
const webpackPath = require.main.path;

const modulesPath = path.resolve(webpackPath, '../../');
const projectPath = path.resolve(modulesPath, '../');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  target: 'node',
  entry: path.resolve(projectPath, 'src/index.ts'),
  output: {
    filename: 'index.js'
  }
});
