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
    <Reactions.LikeButton count={0} />
    <Reactions.BookmarkButton count={0} />
  </Reactions>
);

export const DefaultReactions = Template.bind({});

DefaultReactions.args = {};
