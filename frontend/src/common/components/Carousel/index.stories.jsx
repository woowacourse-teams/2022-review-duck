import Carousel from '.';

export default {
  title: 'common/components/Carousel',
  component: Carousel,
};

const Template = (args) => (
  <Carousel {...args}>
    {Array.from({ length: 30 }).map(() => (
      <div
        style={{ width: '300px', height: '380px', marginRight: '24px', backgroundColor: '#f3f3f3' }}
      />
    ))}
  </Carousel>
);

export const DefaultText = Template.bind({});

DefaultText.args = {};
