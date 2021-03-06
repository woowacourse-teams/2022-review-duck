const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = (env, options) =>
  merge(common(env, options), {
    mode: 'production',
    devtool: 'hidden-source-map',
    output: {
      path: path.join(__dirname, '../build'),
      publicPath: '/',
      filename: `bundle.${Date.now()}.js`,
    },
  });
