import Profile from '.';

export default {
  title: '@shared/components/Profile',
  component: Profile,
};

export const RoundProfile = (args) => {
  return (
    <Profile direction="row" {...args}>
      <Profile.Image
        size="medium"
        theme="rounded"
        src="https://avatars.githubusercontent.com/u/94832610?v=4"
      />
      <Profile.Nickname>유저 닉네임</Profile.Nickname>
      <Profile.Description>설명</Profile.Description>
    </Profile>
  );
};

export const RectangleProfile = (args) => {
  return (
    <Profile align="center" {...args}>
      <Profile.Image
        size="medium"
        theme="rectangle"
        src="https://avatars.githubusercontent.com/u/94832610?v=4"
      />
      <Profile.Nickname>유저 닉네임</Profile.Nickname>
      <Profile.Description>설명</Profile.Description>
    </Profile>
  );
};
