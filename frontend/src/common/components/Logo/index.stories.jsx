import Logo from 'common/components/Logo';

export default {
  title: 'Component/Common/Logo',
  component: Logo,
};

const Template = (args) => <Logo {...args} />;

export const DefaultLogo = Template.bind({});
