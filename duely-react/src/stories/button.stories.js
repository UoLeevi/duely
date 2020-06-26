import React from 'react';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Button'
};

export const Sizes = () => (
  <div className="panel ma-2">
    <div className="panel-row">
      <button className="default prominent" onClick={action('clicked')}>Prominent</button>
    </div>
    <div className="panel-row">
      <button className="default" onClick={action('clicked')}>Default</button>
    </div>
    <div className="panel-row">
      <button className="default dense" onClick={action('clicked')}>Dense</button>
    </div>
  </div>
);
