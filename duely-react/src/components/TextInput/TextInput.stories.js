import React from 'react';
import { action } from '@storybook/addon-actions';
import TextInput from '.';

export default {
  title: 'TextInput',
  component: TextInput,
};

export const Default = () => {
  return (
    <div className="panel ma-2">
      <div className="panel-row">
        <TextInput label="Label" actions={{ 'action': () => action('clicked') }} completed={ v => v === 'yey' } rules={[ v => v !== 'moi' || "'moi' is not allowed" ]} hint="Try type 'yey'. Please do not type 'moi'"/>
      </div>
    </div>
  )
};
