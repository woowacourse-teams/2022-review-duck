import PopupBox from '.';

export default {
  title: 'common/components/PopupBox',
  component: PopupBox,
};

const Template = (args) => (
  <PopupBox {...args}>
    <p>컨텐츠가 출력됩니다.</p>
  </PopupBox>
);

export const DefaultPopupBox = Template.bind({});
DefaultPopupBox.args = { fallback: <p>여기에 마우스를 올려보세요</p> };
