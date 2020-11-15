import React from 'react';

import { FormErrorInfo } from '.';

export default {
  title: 'Forms/FormErrorInfo',
  component: FormErrorInfo,
  argTypes: {},
};

const Template = (args) => {
  return <FormErrorInfo error={args.error} {...args} />;
};

export const Error = Template.bind({});
Error.args = {
  error: 'Email or password is incorrect'
};
