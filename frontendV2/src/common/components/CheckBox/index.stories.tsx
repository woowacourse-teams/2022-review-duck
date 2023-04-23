import CheckBox from '.';

export default {
  title: 'common/components/CheckBox',
  component: CheckBox,
};

const Template = () => <CheckBox onChange={() => alert('변경!')}>테스트입니다</CheckBox>;

export const DefaultFieldSet = Template.bind({});
