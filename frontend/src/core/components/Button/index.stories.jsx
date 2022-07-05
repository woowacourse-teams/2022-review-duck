import Button from 'core/components/Button';

export default {
  title: 'Component/Common/Button',
  component: Button,
};

const Template = (args) => <Button {...args} />;

export const DefaultButton = Template.bind({});

DefaultButton.args = { type: 'button', children: 'Button' };
