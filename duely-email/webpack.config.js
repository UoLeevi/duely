const CopyPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const nodeConfig = require('./node_modules/@duely/build/webpack/webpack.node.js');
const path = require('path');

const srcDirPath = path.resolve('src');

module.exports = merge(nodeConfig, {
  plugins: [
    // see: https://webpack.js.org/plugins/copy-webpack-plugin/
    new CopyPlugin({
      patterns: [
        {
          from: 'src/templates/**/*',
          to({ context, absoluteFilename }) {
            return absoluteFilename.substring(srcDirPath.length + 1);
          }
        }
      ]
    })
  ]
});
