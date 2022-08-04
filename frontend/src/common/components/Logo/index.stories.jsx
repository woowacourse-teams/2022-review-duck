import Logo from '.';

export default {
  title: 'common/components/Logo',
  component: Logo,
};

const Template = (args) => <Logo {...args} />;

export const DefaultLogo = Template.bind({});
