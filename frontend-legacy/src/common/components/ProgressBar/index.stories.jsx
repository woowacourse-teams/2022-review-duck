import ProgressBar from '.';

export default {
  title: 'common/components/ProgressBar',
  component: ProgressBar,
};

const Template = (args) => <ProgressBar {...args} />;

export const DefaultProgressBar = Template.bind({});

DefaultProgressBar.args = {
  percent: 40,
};
