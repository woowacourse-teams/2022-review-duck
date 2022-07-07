import ReviewLayout from '.';

export default {
  title: 'review/layout/ReviewLayout',
  component: ReviewLayout,
};

const Template = (args) => <ReviewLayout {...args} />;

export const DefaultLayout = Template.bind({});

DefaultLayout.args = {};
