import SubmitReviewPage from 'service/review/pages/SubmitReviewPage';

export default {
  title: 'Service/Page/SubmitReviewPage',
  component: SubmitReviewPage,
};

const Template = (args) => <SubmitReviewPage {...args} />;

export const DefaultSubmitReviewPage = Template.bind({});

DefaultSubmitReviewPage.args = {};
