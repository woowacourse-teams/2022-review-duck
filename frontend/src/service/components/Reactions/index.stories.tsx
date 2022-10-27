import { ComponentStory } from '@storybook/react';

import Reactions from '.';

export default {
  title: '@shared/components/Reactions',
  component: Reactions,
  parameters: {
    layout: 'centered',
  },
};

const Template: ComponentStory<typeof Reactions> = (args) => (
  <Reactions {...args}>
    <Reactions.LikeButton />
    <Reactions.BookmarkButton />
  </Reactions>
);

export const DefaultReactions = Template.bind({});

DefaultReactions.args = {};
