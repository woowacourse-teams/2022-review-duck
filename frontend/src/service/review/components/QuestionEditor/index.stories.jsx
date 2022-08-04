import QuestionEditor from '.';

export default {
  title: 'Review/components/QuestionEditor',
  component: QuestionEditor,
};

const Template = (args) => <QuestionEditor {...args} />;

export const DefaultQuestionEditor = Template.bind({});

DefaultQuestionEditor.args = {};
