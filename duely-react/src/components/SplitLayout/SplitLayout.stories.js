import React from 'react';
import SplitLayout from '../SplitLayout';

export default {
  title: 'SplitLayout',
  component: SplitLayout,
  parameters: {
    layout: 'fullscreen'
  }
};

export const Default = () => {
  return (
    <SplitLayout 
      left={
        <div className="background-bg bg-l3" data-layout="collapse-sm 3fr">
          <div className="panel">
            <div className="panel-row">
              <h2>Left</h2>
            </div>
            <div className="panel-row">
              <p>
                some content with <code>data-layout="collapse-sm 3fr"</code>
              </p>
            </div>
          </div>
        </div> 
      }
      right={
        <div className="" data-layout="center 5fr">
          <div className="panel">
            <div className="panel-row center-h">
              <h2>Right</h2>
            </div>
            <div className="panel-row">
              <p>
                some content with <code>data-layout="center 5fr"</code>
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
};
