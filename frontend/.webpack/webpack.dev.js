const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env, options) =>
  merge(common(env, options), {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ['ts-loader'],
        },
      ],
    },
  });
