import Modal from '.';

export default {
  title: 'common/components/Modal',
  component: Modal,
};

const Template = (args) => <Modal {...args} />;

export const DefaultModal = Template.bind({});

DefaultModal.args = {
  isVisible: true,
  children: <p>테스트 내용</p>,
};
