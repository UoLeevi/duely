import React, { useState, useEffect } from 'react';
import Choose from '../Choose';
import Spinner from '../Spinner';
import Button from 'components/Button';

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
  },
  argTypes: {
    index: { disable: true }
  }
};

export const ToggleContent = ({ placeItems }) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="panel ma-2">
      <div className="panel-row">
        <Button onClick={ () => setIndex((index + 1) % 3) }>Toggle</Button>
      </div>
      <div className="panel-row">
        <Choose index={ index } placeItems={ placeItems }>
          <span>Choose component selects is size based on the largest child.</span>
          <span>Other items are centered</span>
          <span data-choose="center left">Individual child justified left</span>
        </Choose>
      </div>
    </div>
  );
};

ToggleContent.args = {
  placeItems: 'center'
}

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
          <Button onClick={ () => setLoading(true) }>Start loading</Button>
          <Spinner data-choose="fit" />
        </Choose>
      </div>
    </div>
  );
};
