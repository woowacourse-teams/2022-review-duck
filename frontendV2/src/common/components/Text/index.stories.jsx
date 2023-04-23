import Text from '.';

export default {
  title: 'common/components/Text',
  component: Text,
};

const Template = (args) => <Text {...args} />;

export const DefaultText = Template.bind({});

DefaultText.args = { weight: 'bold', size: '16', children: '텍스트 입력' };
