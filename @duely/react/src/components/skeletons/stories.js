import React from 'react';

import { SkeletonText } from '.';

export default {
  title: 'Sekeletons/SkeletonText',
  component: SkeletonText,
  argTypes: {},
};

const Template = (args) => {
  return <SkeletonText {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  className: '',
  ch: 20
};
