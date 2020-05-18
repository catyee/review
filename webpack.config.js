const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件
const path = require('path')
module.exports = {
    entry: './js/promise/generator.js',
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({template: './js/promise/generator.html'})
      ],
      module: {
       rules:[
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/transform-runtime']
              }
            }
           }
       ] 
      },
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-first-webpack.bundle.js'
      },
      devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
      }
}