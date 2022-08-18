import QuestionsEditorItem from '.';

export default {
  title: 'shared/components/QuestionsEditorItem',
  component: QuestionsEditorItem,
};

const Template = (args) => <QuestionsEditorItem {...args} />;

export const DefaultQuestionsEditorItem = Template.bind({});

DefaultQuestionsEditorItem.args = {};
