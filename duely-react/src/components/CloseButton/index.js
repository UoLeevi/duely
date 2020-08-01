import React from 'react';
import { motion } from 'framer-motion';
import './CloseButton.css';

const CloseButton = ({ onClick, size = '1rem', svgAnimation, pathAnimation, bottom, left, className, ...props }) => {
  const defaultSvgAnimation = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
    exit: { scale: 0 },
    style: { height: size, originX: '50%', originY: '50%' },
    transition: { duration: 0.3, ease: 'easeInOut' }
  };

  const defaultPathAnimation = {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    exit: { pathLength: 0 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  };

  className = Array.from(new Set(((className ?? '') + ` close-button ${ bottom ? 'bottom' : 'top' } ${ left ? 'left' : 'right'}`).split(' '))).join(' ');

  return (
    <button className={ className } onClick={ onClick } tabIndex="0" { ...props }>
      <motion.svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg"
      { ...(svgAnimation || defaultSvgAnimation) }
      >
        <motion.path fill="none" strokeWidth="30" d="M-90 -90 L 90 90" 
          { ...(pathAnimation || defaultPathAnimation) }
        />
        <motion.path fill="none" strokeWidth="30" d="M-90 90 L 90 -90" 
          { ...(pathAnimation || defaultPathAnimation) }
        />
      </motion.svg>
    </button>
  );
};

export default CloseButton;
