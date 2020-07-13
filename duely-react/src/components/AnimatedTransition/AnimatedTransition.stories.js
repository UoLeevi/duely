import React, { useState } from 'react';
import AnimatedTransition from '../AnimatedTransition';

export default {
  title: 'AnimatedTransition',
  component: AnimatedTransition,
};

export const ConditionalElement = () => {
  const [visible, setVisible] = useState(true);
  const handleClick = () => {
    setTimeout(() => setVisible(true), 2000);
    setVisible(false);
  };

  return (
    <AnimatedTransition>
      { visible && <button onClick={ handleClick }>Click me</button> }
    </AnimatedTransition>
  );
};

export const ChangingElement = () => {
  const [index, setIndex] = useState(0);
  const handleClick = () => {
    if (index === 0) {
      setIndex(1)
    } else {
      setIndex(2)
      setTimeout(() => setIndex(0), 2000);
    }
  };

  const children = [
    <button onClick={ handleClick }>Click me 1</button>,
    <button onClick={ handleClick }>Click me 2</button>,
    null
  ];

  return (
    <AnimatedTransition>
      { children[index] }
    </AnimatedTransition>
  );
};
