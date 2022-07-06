import ProgressBar from 'common/components/ProgressBar';

export default {
  title: 'Component/Common/ProgressBar',
  component: ProgressBar,
};

const Template = (args) => <ProgressBar {...args} />;

export const DefaultProgressBar = Template.bind({});

DefaultProgressBar.args = {
  percent: 40,
};
