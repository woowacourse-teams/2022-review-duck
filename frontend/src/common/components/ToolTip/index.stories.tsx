import ToolTip from '.';

import { ComponentStory } from '@storybook/react';

export default {
  title: 'common/components/ToolTip',
  component: ToolTip,
};

const Template: ComponentStory<typeof ToolTip> = (args) => (
  <ToolTip {...args}>여기에 마우스를 올려보세요!</ToolTip>
);

export const DefaultToolTip = Template.bind({});

DefaultToolTip.args = {
  text: '이곳에 툴팁이 출력됩니다.',
};
