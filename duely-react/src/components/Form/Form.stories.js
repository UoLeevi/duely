import React from 'react';
import Form from '../Form';
import TextInput from 'components/TextInput';
import { emailFieldProps, passwordFieldProps } from 'components/TextInput/presets';
import Button from 'components/Button';

export default {
  title: 'Form',
  component: Form,
};

export const Default = () => {
  return (
    <Form className="w-form" handleSubmit={ data => alert('Form submitted with data:\n' + JSON.stringify(data)) }>
      <TextInput name="email" { ...emailFieldProps } autoFocus completed={ null } />
      <TextInput name="password" { ...passwordFieldProps } completed={ null } />
      <Button className="mt-2" areaWidth="40ch" prominent filled color="primary">Submit</Button>
    </Form>
  );
};
