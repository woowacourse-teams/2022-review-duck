import FieldSet from 'common/components/FieldSet';

export default {
  title: 'Component/Common/FieldSet',
  component: FieldSet,
};

const Template = (args) => <FieldSet {...args} />;

export const DefaultFieldSet = Template.bind({});

DefaultFieldSet.args = {
  title: '참여 코드',
  children: '이 곳에 입력폼이 들어옵니다.',
  description: '회고 참여를 위한 코드를 입력해주세요.',
};
