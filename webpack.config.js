const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development'; // запускаем режим development
const isProd = !isDev; // режим production
//    "start": "cross-env NODE_ENV=development webpack-dev-server --open",


const filename = (ext) => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

const jsLoaders = ()=>{
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ];

  if (isDev) { // if mode development push to obj eslint-loader
    loaders.push('eslint-loader');
  }

  return loaders;
};
console.log('isProd', isProd);

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',
  mode: 'development',
  devtool: isDev ? 'source-map' : false,
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    hot: isDev, // дает возможность не обновлять страницу при изменениях
    port: 3000,
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({template: 'index.html'}),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {from: path.resolve(__dirname, 'src/favicon.ico'), to: path.resolve(__dirname, 'dist')},
      ],
    }),
    new MiniCssExtractPlugin({filename: filename('css')}),
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'), // '.../.../.../src/'=>@/
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};


