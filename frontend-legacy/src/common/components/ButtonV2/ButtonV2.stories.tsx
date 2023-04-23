import { ComponentStory } from '@storybook/react';

import ButtonV2 from './ButtonV2';

export default {
  title: 'common/components/PaginationBar',
  component: ButtonV2,
};

const Template: ComponentStory<typeof ButtonV2> = (args) => <ButtonV2 {...args} />;

export const PlainButton = Template.bind({});

PlainButton.args = {};
