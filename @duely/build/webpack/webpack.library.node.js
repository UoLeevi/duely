const path = require('path');

// {projectPath}\node_modules\webpack\bin
const webpackPath = require.main.path;

const modulesPath = path.resolve(webpackPath, '../../');
const webpack = require(path.resolve(modulesPath, 'webpack'));

const { merge } = require('webpack-merge');
const libraryConfig = require('./webpack.library.js');

module.exports = merge(libraryConfig, {
  target: 'node',
  plugins: [
    // see: https://github.com/brianc/node-postgres/issues/838
    new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })
  ]
});
