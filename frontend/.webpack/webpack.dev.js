const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env, options) => {
  const loader = options.mode
    ? {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      }
    : {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      };

  return merge(common(env, options), {
    mode: options.mode,
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
    },
    module: {
      rules: [loader],
    },
  });
};
