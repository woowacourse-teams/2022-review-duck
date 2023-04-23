import TemplateCard from '.';

export default {
  title: 'template/components/TemplateCard',
  component: TemplateCard,
};

const Template = (args) => <TemplateCard {...args} />;

export const DefaultSmallProfileCard = Template.bind({});

DefaultSmallProfileCard.args = {
  templateId: 0,
  templateTitle: '팀회고덕 스프린트 회고 템플릿',
  templateDescription:
    '우아한테크코스 회고덕 팀이 매 스프린트가 끝난 후 감정, 개선사항, 팀 문화 등에 대해서 회고하는 템플릿입니다.',
  creator: {
    nickname: '돔하디',
    socialId: 'DomMorello',
    profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
  },
  updatedAt: 1660208392269,
  usedCount: 143,
};
