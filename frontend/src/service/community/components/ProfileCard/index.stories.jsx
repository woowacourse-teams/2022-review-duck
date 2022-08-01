import ProfileCard from '.';

export default {
  title: 'community/components/ProfileCard',
  component: ProfileCard,
};

const Template = (args) => <ProfileCard {...args} />;

export const DefaultProfile = Template.bind({});

DefaultProfile.args = {
  profileUrl: 'test',
  githubNickname: 'DomMorello',
  githubStatus: 'test',
  nickname: '돔하디',
  numberOfReviews: 12,
  numberOfRevieForms: 4,
};
