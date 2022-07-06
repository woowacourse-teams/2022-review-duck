import JoinReviewPage from 'service/review/pages/JoinReviewPage';

export default {
  title: 'Service/Page/JoinReviewPage',
  component: JoinReviewPage,
};

const Template = (args) => <JoinReviewPage {...args} />;

export const DefaultJoinReviewPage = Template.bind({});

DefaultJoinReviewPage.args = {};
