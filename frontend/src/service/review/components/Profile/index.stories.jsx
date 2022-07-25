import Profile from '.';

export default {
  title: 'review/components/Profile',
  component: Profile,
  parameters: {
    layout: 'centered',
  },
};

const Template = (args) => <Profile {...args} />;

export const DefaultProfile = Template.bind({});

DefaultProfile.args = {};
