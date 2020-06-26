import React, { useState, useEffect } from 'react';
import { text } from '@storybook/addon-knobs';
import Choose from '../Choose';
import Spinner from '../Spinner';

export default {
  title: 'Choose',
  component: Choose,
  parameters: {
    info: {
      text: `
        Component chooses it's content from list of children using and index.
        All items are rendered but only item specified by index is visible.

        Component's size is determied by its largest child.
        By default, items are centered both horizontally and vertically,
        but the alignment can be controlled using ~justifyItems~ and ~alignItems~
        props and by aligning individual children using directonal props or data
        attributes (e.g. ~data-left~).

        To make child's size dynamically fit the choose component, use ~fit~ prop or
        ~data-fit~ data attribute.
      `
    }
  }
};

export const ToggleContent = () => {
  const [index, setIndex] = useState(0);

  return (
    <div className="panel ma-2">
      <div className="panel-row">
        <button className="default" onClick={ () => setIndex((index + 1) % 3) }>Toggle</button>
      </div>
      <div className="panel-row">
        <Choose index={ index } justifyItems={ text('justifyItems', 'center') } alignItems={ text('alignItems', 'center') }>
          <span>Choose component selects is size based on the largest child.</span>
          <span>Other items are centered</span>
          <span data-left>Individual child justified left</span>
        </Choose>
      </div>
    </div>
  );
};

export const LoadingSpinner = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const timeoutId = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timeoutId);
  }, [loading, setLoading]);

  return (
    <div className="panel ma-2">
      <div className="panel-row">
        <Choose index={ loading ? 1 : 0 } >
          <button className="default" onClick={ () => setLoading(true) }>Start loading</button>
          <Spinner fit />
        </Choose>
      </div>
    </div>
  );
};
