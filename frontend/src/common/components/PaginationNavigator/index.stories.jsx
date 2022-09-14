import PaginationNavigator from '.';

export default {
  title: 'common/components/PaginationNavigator',
  component: PaginationNavigator,
};

const Template = (args) => <PaginationNavigator {...args} />;

export const DefaultPaginationNavigator = Template.bind({});
DefaultPaginationNavigator.args = {
  itemCountInPage: 5,
  totalItemCount: 63,
  pathname: 'some/pathname',
};
