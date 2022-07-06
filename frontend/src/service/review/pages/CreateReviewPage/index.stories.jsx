import CreateReviewPage from 'service/review/pages/CreateReviewPage';

export default {
  title: 'Service/Page/CreateReviewPage',
  component: CreateReviewPage,
};

const Template = (args) => <CreateReviewPage {...args} />;

export const DefaultCreateReviewPage = Template.bind({});

DefaultCreateReviewPage.args = {};
