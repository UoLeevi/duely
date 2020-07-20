import React, { useRef, useState } from 'react';
import useModal from 'hooks/useModal';
import TextField from 'components/TextField';
import Button from 'components/Button';

export default {
  title: 'Modal'
};

export const Default = () => {
  const [text, setText] = useState();
  const hideModalRef = useRef();
  const showModal = useModal(
    <div className="panel">
      <div className="panel-row">
        <h2 className="default f-b">Heading</h2>
      </div>
      <div className="panel-row">
        <span>Could be any content here</span>
      </div>
      <div className="panel-row">
        <TextField label="Label" text={ text } setText={ setText } />
      </div>
      <div className="panel-row center-h">
        <Button onClick={ () => hideModalRef.current() }>Click me</Button>
      </div>
    </div>,
    { hideModalRef }
  );
  return (
    <div className="panel ma-2">
      <div className="panel-row">
        <Button onClick={ showModal }>Show modal</Button>
      </div>
    </div>
  )
};
