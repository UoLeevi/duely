const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = [
  {
    // @duely/react npm package
    devtool: 'source-map',
    entry: './src/index.ts',
    externals: ['react', 'react-dom', 'react-hook-form', 'react-router-dom', '@duely/client'],
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
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      library: '@duely/react',
      libraryTarget: 'umd'
    }
  },
  {
    // demo app to ease experimentation
    devtool: 'source-map',
    devServer: {
      hot: true,
      inline: true,
      contentBase: [
        path.resolve(__dirname, 'dist', 'demo'),
        path.resolve(__dirname, 'public', 'demo')
      ],
      writeToDisk: true
    },
    entry: './src/demo/index.tsx',
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
        template: 'public/demo/index.html',
        filename: 'index.html',
        inject: 'body'
      })
    ],
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx']
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist', 'demo')
    }
  }
];
