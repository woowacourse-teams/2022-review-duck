import QuestionsEditor from '.';

export default {
  title: 'shared/components/QuestionsEditor',
  component: QuestionsEditor,
};

const Template = (args) => <QuestionsEditor {...args} />;

export const DefaultQuestionsEditor = Template.bind({});

DefaultQuestionsEditor.args = {};
