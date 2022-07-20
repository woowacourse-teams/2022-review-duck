import Reaction from '.';

export default {
  title: 'review/components/Reaction',
  component: Reaction,
};

const Template = (args) => <Reaction {...args} />;

export const DefaultReaction = Template.bind({});

DefaultReaction.args = {};
