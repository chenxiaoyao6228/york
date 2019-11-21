const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "development",
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir);
    const entry = path.join(fullDir, "index.js");
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ["webpack-hot-middleware/client", entry];
    }
    return entries;
  }, {}),
  output: {
    path: path.join(__dirname, "__build__"),
    filename: "[name].js",
    publicPath: "/__build__/"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader" // compiles Less to CSS
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
    // new CleanWebpackPlugin(),
    // new MiniCssExtractPlugin({
    // 	// Options similar to the same options in webpackOptions.output
    // 	// both options are optional
    // 	filename: '[name].css',
    // 	chunkFilename: '[id].css'
    // }),
    // new HtmlWebpackPlugin({
    // 	template: 'index.html'
    // })
  ],
  devtool: "source-map",
  devServer: {
    port: process.env.PORT || 8080
  }
};
