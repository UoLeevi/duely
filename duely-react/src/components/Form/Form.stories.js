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
    <div className="panel">
      <Form>
        <TextField { ...emailFieldProps } autoFocus completed={ null } />
        <TextField { ...passwordFieldProps } completed={ null } />
        <Button areaWidth="40ch">Submit</Button>
      </Form>
    </div>
  );
};
