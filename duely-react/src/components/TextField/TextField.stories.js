import React from 'react';
import TextField from '../TextField';

export default {
  title: 'TextField',
  component: TextField,
};

export const Default = () => {
  return (
    <div className="panel ma-2">
      <div className="panel-row">
        <TextField label="Label"/>
      </div>
    </div>
  )
};
