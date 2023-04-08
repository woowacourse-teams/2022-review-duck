const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
      filename: `[name].${app.version}.[contenthash].js`,
      clean: true,
      asyncChunks: true,
      chunkLoadTimeout: 30000,
      chunkFilename: `[name].${app.version}.[contenthash].js`,
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
          generator: {
            filename: 'static/[name].[contenthash][ext][query]',
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
          test: /\.(js?x|ts?x)$/,
          use: [
            { loader: 'babel-loader' },
            {
              loader: '@linaria/webpack-loader',
              options: {
                sourceMap: process.env.NODE_ENV !== 'production',
              },
            },
          ],
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
        __MSW_DIR__: JSON.stringify(parsedEnv.MOCKING ? './mocks/browser.js' : ''),
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [autoprefixer()],
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        inject: 'head',
      }),
      new MiniCssExtractPlugin({
        linkType: false,
        filename: `css/[name].${app.version}.[contenthash].css`,
      }),
      new CopyPlugin({
        patterns: [
          { from: './public/manifest.json', to: '.' },
          { from: './public/static/app-icon.png', to: './static/' },
        ],
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };
};
