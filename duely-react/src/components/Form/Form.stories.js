import React from 'react';
import Form from '../Form';
import TextField from 'components/TextField';
import { emailFieldProps, passwordFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';

export default {
  title: 'Form',
  component: Form,
};

export const Default = () => {
  return (
    <Form className="w-panel" handleSubmit={ data => alert('Form submitted with data:\n' + JSON.stringify(data)) }>
      <TextField data-form="email" { ...emailFieldProps } autoFocus completed={ null } />
      <TextField data-form="password" { ...passwordFieldProps } completed={ null } />
      <Button className="mt-2" areaWidth="40ch" prominent filled color="primary">Submit</Button>
    </Form>
  );
};
