import SmallProfileCard from '.';

export default {
  title: 'shared/components/SmallProfileCard',
  component: SmallProfileCard,
};

const Template = (args) => <SmallProfileCard {...args} />;

export const DefaultSmallProfileCard = Template.bind({});

DefaultSmallProfileCard.args = {
  profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
  primaryText: '돔하디',
  secondaryText: 'DomMorello',
};
