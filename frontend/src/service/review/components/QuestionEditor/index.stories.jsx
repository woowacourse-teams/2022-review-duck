import QuestionEditor from '.';

export default {
  title: 'Review/Component/QuestionEditor',
  component: QuestionEditor,
};

const Template = (args) => <QuestionEditor {...args} />;

export const DefaultQuestionEditor = Template.bind({});

DefaultQuestionEditor.args = {};
