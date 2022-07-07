import QuestionCard from '.';

export default {
  title: 'Component/QuestionCard',
  component: QuestionCard,
};

const Template = (args) => <QuestionCard {...args} />;

export const DefaultQuestionCard = Template.bind({});

DefaultQuestionCard.args = {
  numbering: 1,
  title: '질문 타이틀이 입력됩니다.',
  description: '질문의 설명이 입력됩니다.',
};
