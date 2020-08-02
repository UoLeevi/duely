import React from 'react';
import TextInput from 'components/TextInput';
import FileInput from 'components/FileInput';
import Button from 'components/Button';
import Form from 'components/Form';

const CreateBrandForm = React.forwardRef(({ ...props }, ref) => {

  const handleSubmit = async (data) => {
    console.log(data);
  }

  return (
    <Form className="w-panel" handleSubmit={ handleSubmit } { ...props } ref={ ref }>
      <h2 className="default f-b mb-2" style={{ alignSelf: 'center' }}>Create brand</h2>
      <TextInput name="name" label="Brand name" type="text" autoFocus required />
      <FileInput name="imageLogo" label="Logo image" type="image" required />
      <Button className="my-2" areaWidth="40ch" prominent filled color="primary">Continue</Button>
    </Form>
  );
});

export default CreateBrandForm;
