import React from 'react';
import { action } from '@storybook/addon-actions';
import TextField from '../TextField';

export default {
  title: 'TextField',
  component: TextField,
};

export const Default = () => {
  return (
    <div className="panel ma-2">
      <div className="panel-row">
        <TextField label="Label" actions={{ 'action': () => action('clicked') }}/>
      </div>
    </div>
  )
};
