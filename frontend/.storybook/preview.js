import { withRootAttribute } from 'storybook-addon-root-attribute';

import 'styles/@global.scss';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  rootAttribute: {
    attribute: 'data-theme',
    defaultState: {
      name: 'Default',
      value: 'light',
    },
    states: [
      {
        name: 'Dark',
        value: 'dark',
      },
    ],
  },
};

export const decorators = [withRootAttribute];
