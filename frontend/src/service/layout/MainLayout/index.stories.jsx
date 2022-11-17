import MainLayout from '.';

export default {
  title: 'shared/layout/MainLayout',
  component: MainLayout,
};

const Template = (args) => <MainLayout {...args} />;

export const DefaultLayout = Template.bind({});

DefaultLayout.args = {};
