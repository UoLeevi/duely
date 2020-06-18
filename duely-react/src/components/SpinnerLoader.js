import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DuelyLogo from './DuelyLogo';

const SpinnerLoader = ({ children, loading, size = '4rem' }) => {
  const svgAnimation = {
    initial: { rotate: 0, opacity: 1 },
    animate: { rotate: 360, transition: { loop: Infinity, duration: 1.2, ease: 'linear' } },
    exit: { opacity: 0 },
    style: { originX: '50%', originY: '50%' },
    transition: { duration: 0.4, ease: 'linear' }
  };

  const pathAnimation = {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    exit: { pathLength: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    transition: { duration: 0.4, ease: 'easeInOut' }
  };

  const fadeAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <AnimatePresence exitBeforeEnter>
      { loading 
        ? <motion.div key="loader" { ...fadeAnimation }><DuelyLogo size={ size } svgAnimation={ svgAnimation } pathAnimation={ pathAnimation } /></motion.div>
        : <motion.div key="content" { ...fadeAnimation }>{ children }</motion.div>
      }
    </AnimatePresence>
   );
};

export default SpinnerLoader;
