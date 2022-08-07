import Textarea from '.';

export default {
  title: 'common/components/Textarea',
  component: Textarea,
};

const Template = (args) => <Textarea {...args} />;

export const DefaultTextBox = Template.bind({});

DefaultTextBox.args = {};
