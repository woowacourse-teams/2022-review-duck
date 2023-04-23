import Button from '.';

export default {
  title: 'common/components/Button',
  component: Button,
};

const Template = (args) => <Button {...args} />;

export const DefaultButton = Template.bind({});

DefaultButton.args = { type: 'button', children: 'Button' };
