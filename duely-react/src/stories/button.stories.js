import React from 'react';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Buttons'
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
    <div className="panel-row">
      <button className="default filled primary-bg white" onClick={action('clicked')}>Filled</button>
    </div>
    <div className="panel-row">
      <button className="default flat" onClick={action('clicked')}>Flat</button>
    </div>
    <div className="panel-row">
      <button className="default text" onClick={action('clicked')}>Text</button>
    </div>
  </div>
);
