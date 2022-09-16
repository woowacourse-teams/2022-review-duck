const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env, options) =>
  merge(common(env, options), {
    mode: 'production',
    devtool: false,
  });
