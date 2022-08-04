import TextBox from '.';

export default {
  title: 'Common/Components/TextBox',
  component: TextBox,
};

const Template = (args) => <TextBox {...args} />;

export const DefaultTextBox = Template.bind({});

DefaultTextBox.args = {};
