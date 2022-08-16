import Profile from '.';

export default {
  title: '@shared/components/Profile',
  component: Profile,
};

const Template = (args) => (
  <Profile {...args}>
    <Profile.Image
      size="medium"
      theme="rectangle"
      src="https://avatars.githubusercontent.com/u/94832610?v=4"
    />
    <Profile.Nickname>유저 닉네임</Profile.Nickname>
    <Profile.Description>설명</Profile.Description>
  </Profile>
);

export const DefaultProfile = Template.bind({});
