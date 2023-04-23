import Skeleton from '.';

export default {
  title: 'common/components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
};

const Template = (args) => <Skeleton {...args} />;

export const DefaultSkeleton = Template.bind({});

DefaultSkeleton.args = {};
