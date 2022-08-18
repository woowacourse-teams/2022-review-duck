import { withRootAttribute } from 'storybook-addon-root-attribute';

import '!style-loader!css-loader!sass-loader!material-icons/iconfont/material-icons.css';
import 'styles/@app.scss';

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
