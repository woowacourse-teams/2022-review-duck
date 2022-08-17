import Questions from '.';

export default {
  title: '@shared/components/Questions',
  component: Questions,
};

const Template = (args) => (
  <Questions {...args}>
    <Questions.CoverProfile
      image="https://avatars.githubusercontent.com/u/94832610?v=4"
      title="닉네임 또는 타이틀"
      description="프로필 소개 또는 커버 설명"
    />
    <Questions.Title>큰 타이틀</Questions.Title>
    <Questions.EditButtons isVisible={true} editLink="" deleteLink="" />
    <Questions.Answer question="질문" description="설명">
      답변
    </Questions.Answer>
    <Questions.Reaction />
  </Questions>
);

export const DefaultQuestions = Template.bind({});
