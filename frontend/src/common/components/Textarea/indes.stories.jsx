import Textarea from '.';

export default {
  title: 'Common/Components/Textarea',
  component: Textarea,
};

const Template = (args) => <Textarea {...args} />;

export const DefaultTextBox = Template.bind({});

DefaultTextBox.args = {};
