import React from 'react';
import { motion } from 'framer-motion';

const DuelyLogo = ({ size = '4rem', svgAnimation, pathAnimation, ...props }) => {
  const defaultSvgAnimation = {
    initial: { rotate: -520 },
    animate: { rotate: 0 },
    exit: { rotate: -180, transition: { duration: 0.3, ease: 'easeInOut' }  },
    style: { height: size, originX: '50%', originY: '50%' },
    transition: { delay: 1.2, duration: 1.2 }
  };

  const defaultPathAnimation = {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    exit: { pathLength: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    transition: { delay: 1.2, duration: 1.2, ease: 'easeInOut' }
  };

  return (
    <motion.svg className="duely-logo" viewBox="-300 -300 600 600" xmlns="http://www.w3.org/2000/svg"
      { ...(svgAnimation || defaultSvgAnimation) }
      { ...props }
    >
      <motion.path fill="none" stroke="#000000" strokeWidth="20" d="M-4.29,-59.19a100,100,0,1,0,-170.71,-70.71l0,241.4z" shapeRendering="geometricPrecision"
        { ...(pathAnimation || defaultPathAnimation) }
      />
      <motion.path fill="none" stroke="#000000" strokeWidth="20" d="M53.41,25.88a100,100,0,1,0,146.59,-112.48l-209.06,-120.7z" shapeRendering="geometricPrecision"
        { ...(pathAnimation || defaultPathAnimation) }
      />
      <motion.path fill="none" stroke="#000000" strokeWidth="20" d="M-49.12,33.31a100,100,0,1,0,24.12,183.19l209.06,-120.7z" shapeRendering="geometricPrecision"
        { ...(pathAnimation || defaultPathAnimation) }
      />
    </motion.svg>
  );
};

export default DuelyLogo;
