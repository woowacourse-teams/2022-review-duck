import TagLabel from '.';

export default {
  title: 'common/components/TagLabel',
  component: TagLabel,
};

const Template = (args) => <TagLabel {...args} />;

export const DefaultTagLabel = Template.bind({});

DefaultTagLabel.args = {
  children: '149회',
};
