import Snackbar from './component';

export default {
  title: 'common/components/Snackbar',
  component: Snackbar,
  parameters: {
    layout: 'centered',
  },
};

const Template = (args) => <Snackbar {...args} />;

export const DefaultSnackbar = Template.bind({});

DefaultSnackbar.args = {};
