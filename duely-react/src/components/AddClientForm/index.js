import React, { useState } from 'react';
import { mutate } from 'apollo';
import TextInput from 'components/TextInput';
import { emailFieldProps } from 'components/TextInput/presets';
import Button from 'components/Button';
import Form from 'components/Form';
import { createClassName } from 'utils';

const AddClientForm = React.forwardRef(({ agencyUuid, className, ...props }, ref) => {
  const [state, setState] = useState({ completed: undefined, error: undefined, loading: undefined });

  const handleSubmit = async (data) => {
    try {
      const { name, emailAddress } = data;

      setState({ loading: true });
      const result = await mutate('createClient', { agencyUuid, name, emailAddress });

      if (result.success) {

        setState({ 
          loading: false,
          completed: (
            <div className="flex gap-4 column center-h">
              <span className="success f-b">A client { name } has been added.</span>
            </div>
          )
        });

      } else {
        setState({ error: result.message });
        setTimeout(() => setState({ loading: false }), 4000);
      }

    } catch (error) {
      setState({ error: error.message });
      setTimeout(() => setState({ loading: false }), 4000);
    }
  }

  className = createClassName(className, 'w-form');

  return (
    <Form className={ className } handleSubmit={ handleSubmit } areaWidth="60ch" completed={ state.completed } { ...props } ref={ ref }>
      <h3 className="default f-b mb-2" style={{ alignSelf: 'center' }}>Add client</h3>
      <TextInput name="name" label="Client name" type="text" autoFocus required rules={[v => (v && v.length <= 70) || 'Client name must be at most 70 characters']} />
      <TextInput name="emailAddress" { ...emailFieldProps } required={ false } />
      <Button className="mt-label-text" areaWidth="40ch" prominent filled color="primary" loading={ state.loading } error={ state.error }>Add client</Button>
    </Form>
  );
});

export default AddClientForm;
