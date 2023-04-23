const path = require('path');
const common = require('../.webpack/webpack.common.js');

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackRules = common({}, { mode: 'development' }).module.rules;

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-root-attribute/register',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    config.module.rules.push(...webpackRules);
    config.resolve.modules = [...(config.resolve.modules || []), path.resolve(__dirname, '../src')];

    config.plugins.push(
      new webpack.EnvironmentPlugin(process.env),
      new MiniCssExtractPlugin({ linkType: false, filename: 'css/[name].[contenthash].css' }),
    );

    return config;
  },
};
