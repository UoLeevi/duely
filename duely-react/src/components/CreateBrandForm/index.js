import React from 'react';
import TextField from 'components/TextField';
import Button from 'components/Button';
import Form from 'components/Form';

const CreateBrandForm = React.forwardRef(({ ...props }, ref) => {

  const handleSubmit = async (data) => {
  }

  return (
    <Form className="w-panel" handleSubmit={ handleSubmit } { ...props } ref={ ref }>
      <h2 className="default f-b mb-2" style={{ alignSelf: 'center' }}>Create brand</h2>
      <TextField data-form="name" label="Brand name" type="text" autoFocus required />
      <Button className="my-2" areaWidth="40ch" prominent filled color="primary">Continue</Button>
    </Form>
  );
});

export default CreateBrandForm;
