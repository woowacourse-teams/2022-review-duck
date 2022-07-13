import TextBox from '.';

export default {
  title: 'Common/Component/TextBox',
  component: TextBox,
};

const Template = (args) => <TextBox {...args} />;

export const DefaultTextBox = Template.bind({});

DefaultTextBox.args = {};
