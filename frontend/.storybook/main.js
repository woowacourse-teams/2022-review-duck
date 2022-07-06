const path = require('path');
const common = require('../.webpack/webpack.common.js');

const webpackRules = common.module.rules;

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    config.module.rules.push(...webpackRules);
    config.resolve.modules = [...(config.resolve.modules || []), path.resolve(__dirname, '../src')];

    return config;
  },
};
