import CommunityLayout from '.';

export default {
  title: 'review/layout/CommunityLayout',
  component: CommunityLayout,
};

const Template = (args) => <CommunityLayout {...args} />;

export const DefaultLayout = Template.bind({});

DefaultLayout.args = {};
