const path = require('path');

// {projectPath}\node_modules\webpack\bin
const webpackPath = require.main.path;

const modulesPath = path.resolve(webpackPath, '../../');
const projectPath = path.resolve(modulesPath, '../');
const webpack = require(path.resolve(modulesPath, 'webpack'));
const package = require(path.resolve(projectPath, 'package.json'));

const externals = Object.keys(package.peerDependencies ?? {});

const alias = {
  '~': path.resolve(projectPath, 'src')
};
Object.keys(package.dependencies ?? {}).map((dep) => (alias[dep] = path.resolve(modulesPath, dep)));

let mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  devtool: 'source-map',
  externals,
  mode,
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            context: projectPath
          }
        },
        include: [path.resolve(projectPath, 'src')]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode)
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    alias
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, '../node_modules'), modulesPath],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main']
  },
  output: {
    path: path.resolve(projectPath, 'dist'),
    clean: mode === 'production'
  }
};
