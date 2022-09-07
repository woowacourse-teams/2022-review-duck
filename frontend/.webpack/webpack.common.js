const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
const app = require('../package.json');
const dotenv = require('dotenv');

module.exports = (env = {}, options = {}) => {
  const { mode } = options;

  dotenv.config({
    path: `./env/${mode || 'development'}.env`,
  });

  const parsedEnv = { ...process.env, ...env };

  return {
    entry: './src/index.tsx',
    resolve: {
      modules: [path.resolve(__dirname, '../src'), 'node_modules'],
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.join(__dirname, '../build'),
      publicPath: process.env.PUBLIC_PATH,
      filename: `app.${app.version}.js`,
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ['babel-loader', 'ts-loader'],
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
          generator: {
            filename: 'static/[name].[hash][ext][query]',
          },
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.css$/i,
          exclude: /\.module\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'postcss-loader', 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: /\.module\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.module\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName:
                    mode === 'development' ? '[local]--[hash:base64:5]' : '[hash:base64:5]',
                  exportLocalsConvention: 'camelCase',
                },
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(parsedEnv),
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [autoprefixer()],
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
      }),
      new MiniCssExtractPlugin({ linkType: false, filename: `css/[name].${app.version}.css` }),
    ],
  };
};
