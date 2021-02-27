const path = require('path');

module.exports = {
  devtool: 'source-map',
  target: 'node',
  entry: {
    index: { import: './src/index.ts', filename: 'index.js' },
    echo: { import: './src/jobs/echo/index.ts', filename: 'jobs/echo/index.js' }
  },
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
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  }
};
