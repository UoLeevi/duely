import React from 'react';
import useModal from 'hooks/useModal';
import TextField from 'components/TextField';

export default {
  title: 'Modal'
};

export const Default = () => {
  const [showModal] = useModal(({ hideModal }) => (
      <div className="panel">
        <div className="panel-row">
          <h2 className="default f-b">Heading</h2>
        </div>
        <div className="panel-row">
          <span>Could be any content here</span>
        </div>
        <div className="panel-row">
          <TextField label="Label" />
        </div>
        <div className="panel-row pt-label-text center-h">
          <button className="default" onClick={ hideModal }>Click me</button>
        </div>
      </div>
    )
  );
  return (
    <div className="panel ma-2">
      <div className="panel-row">
        <button className="default" onClick={ showModal }>Show modal</button>
      </div>
    </div>
  )
};
