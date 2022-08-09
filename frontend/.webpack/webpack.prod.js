const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const package = require('../package.json');

module.exports = (env, options) =>
  merge(common(env, options), {
    mode: 'production',
    devtool: 'hidden-source-map',
    output: {
      path: path.join(__dirname, '../build'),
      publicPath: process.env.PUBLIC_PATH,
      filename: `app.${package.version}.js`,
    },
  });
