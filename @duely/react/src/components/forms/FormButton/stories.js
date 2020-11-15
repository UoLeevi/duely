import React, { useState } from 'react';

import { FormButton } from '.';

export default {
  title: 'Forms/FormButton',
  component: FormButton,
  argTypes: {},
};

const Template = (args) => {
  const [loading, setLoading] = useState(false);

  const onClick = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return <FormButton loading={loading} onClick={onClick} {...args} />;
};

export const Submit = Template.bind({});
Submit.args = {
  children: 'Submit',
  className: ''
};
