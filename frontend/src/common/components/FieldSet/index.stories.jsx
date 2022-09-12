import FieldSet from '.';

export default {
  title: 'common/components/FieldSet',
  component: FieldSet,
};

const Template = () => (
  <FieldSet>
    <FieldSet.Title size="large">닉네임 수정</FieldSet.Title>
    <TextBox
      minLength={2}
      maxLength={10}
      placeholder={nickname}
      value={newNickname}
      onChange={handleChangeNewNickname}
    />
    <FieldSet.Description>10자 이내로 변경할 닉네임을 입력해주세요.</FieldSet.Description>
  </FieldSet>
);

export const DefaultFieldSet = Template.bind({});
