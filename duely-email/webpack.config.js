const CopyPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const nodeConfig = require('./node_modules/@duely/build/webpack/webpack.node.js');

module.exports = merge(nodeConfig, {
  plugins: [
    // see: https://webpack.js.org/plugins/copy-webpack-plugin/
    new CopyPlugin({
      patterns: [{ from: 'src/templates', to: 'templates' }]
    })
  ]
});
