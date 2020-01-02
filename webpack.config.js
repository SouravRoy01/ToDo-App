const path = require('path');

const publicPath = path.resolve(__dirname, 'build')

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: publicPath,
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: publicPath,
    port: 3000
  }
};