import { ComponentStory } from '@storybook/react';

import PaginationBar from '.';

export default {
  title: 'common/components/PaginationBar',
  component: PaginationBar,
};

const Template: ComponentStory<typeof PaginationBar> = (args) => <PaginationBar {...args} />;

export const DefaultPaginationBar = Template.bind({});

DefaultPaginationBar.args = {
  itemCountInPage: 5,
  totalItemCount: 63,
};
