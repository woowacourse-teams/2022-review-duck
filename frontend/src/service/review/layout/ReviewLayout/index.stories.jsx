import ReviewLayout from '.';

export default {
  title: 'Component/ReviewLayout',
  component: ReviewLayout,
};

const Template = (args) => <ReviewLayout {...args} />;

export const DefaultLayout = Template.bind({});

DefaultLayout.args = {};
