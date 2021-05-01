const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    devtool: 'source-map',
    entry: {
      index: {
        import: './src/index.ts',
        filename: 'index.js'
      }
    },
    externals: ['react', 'react-dom', 'react-hook-form', 'react-router-dom', '@duely/client'],
    mode: 'none',
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
    devtool: 'source-map',
    devServer: {
      publicPath: './public',
      contentBase: './dist/demo'
    },
    entry: {
      demo: {
        import: './src/demo/index.tsx',
        filename: 'demo/index.js'
      }
    },
    mode: 'development',
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
        template: './public/index.html',
        filename: 'demo/index.html',
        inject: false
      })
    ],
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx']
    },
    output: {
      path: path.resolve(__dirname, 'dist')
    }
  }
];
