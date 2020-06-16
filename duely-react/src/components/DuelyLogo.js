import React from 'react';
import { motion } from 'framer-motion';

const DuelyLogo = ({ size = '4rem' }) => {
  const svgAnimation = {
    initial: { rotate: -520 },
    animate: { rotate: 0 },
    style: { originX: '50%', originY: '50%' },
    transition: { delay: 1.2, duration: 1.2 }
  }

  const pathAnimation = {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { delay: 1.2, duration: 1.2, ease: 'easeInOut' }
  }

  return (
    <motion.svg height={ size } className="duely-logo" viewBox="-300 -300 600 600" xmlns="http://www.w3.org/2000/svg"
      { ...svgAnimation }
    >
      <motion.path fill="none" stroke="#242a41" strokeWidth="20" d="M-4.29,-59.19a100,100,0,1,0,-170.71,-70.71l0,241.4z" 
        { ...pathAnimation }
      />
      <motion.path fill="none" stroke="#242a41" strokeWidth="20" d="M53.41,25.88a100,100,0,1,0,146.59,-112.48l-209.06,-120.7z" 
        { ...pathAnimation }
      />
      <motion.path fill="none" stroke="#242a41" strokeWidth="20" d="M-49.12,33.31a100,100,0,1,0,24.12,183.19l209.06,-120.7z" 
        { ...pathAnimation }
      />
    </motion.svg>
  );
};

export default DuelyLogo;
