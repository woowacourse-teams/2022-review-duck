import ScrollPanel from '.';

export default {
  title: 'common/components/ScrollPanel',
  component: ScrollPanel,
};

const Template = (args) => (
  <ScrollPanel {...args}>
    {Array.from({ length: 30 }).map(() => (
      <div
        style={{ width: '300px', height: '380px', marginRight: '24px', backgroundColor: '#f3f3f3' }}
      />
    ))}
  </ScrollPanel>
);

export const DefaultText = Template.bind({});

DefaultText.args = {};
