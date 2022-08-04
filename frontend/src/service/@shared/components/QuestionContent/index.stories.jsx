import QuestionContent from '.';

export default {
  title: 'shared/components/QuestionContent',
  component: QuestionContent,
};

const Template = (args) => <QuestionContent {...args} />;

export const DefaultQuestionContent = Template.bind({});

DefaultQuestionContent.args = {
  questions: [
    {
      questionValue: '지금 기분은 어떠신가요?',
      questionDescription: '회고 전 체크인 점수를 입력해주세요.',
      answerValue: '6점, 싫어요.',
    },
  ],
};
