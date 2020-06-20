import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import DuelyLogo from './DuelyLogo';
import { usePrevious } from '../hooks';

const SpinnerLoader = ({ children, loading, size }) => {
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const ref = useRef(null);
  const contentControls = useAnimation();
  const loaderControls = useAnimation();
  const previousLoading = usePrevious(loading);

  useEffect(() => {
    async function animate() {
      const duration = 0.3;

      const [from, to] = loading
        ? [contentControls, loaderControls] 
        : [loaderControls, contentControls];

      if (previousLoading !== undefined) {
        from.stop();
        await from.start({ 
          opacity: 0,
          transition: { duration }
        });
        from.set({ visibility: 'hidden' });
      }

      to.stop();
      from.set({ visibility: 'visible' });
      await to.start({ 
        opacity: 1,
        transition: { duration }
      });
    }

    if (loading !== previousLoading) {
      animate();
    }
  }, [previousLoading, loading, contentControls, loaderControls]);

  useLayoutEffect(() => {
    const { offsetTop: top, offsetLeft: left, clientWidth: width, clientHeight: height } = ref.current;
    setRect({ top, left, width, height });
  }, []);

  const svgAnimation = {
    initial: { rotate: 0, opacity: 1 },
    animate: { rotate: 360, transition: { loop: Infinity, duration: 1.2, ease: 'linear' } },
    exit: { opacity: 0 },
    style: { height: size || rect.height, originX: '50%', originY: '50%' },
    transition: { duration: 0.4, ease: 'linear' }
  };

  const pathAnimation = {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    exit: { pathLength: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    transition: { duration: 0.4, ease: 'easeInOut' }
  };

  const loaderAnimation = {
    animate: loaderControls,
    initial: { opacity: 0 },
    exit: { opacity: 0 },
    style: { position: 'absolute', top: rect.top, left: rect.left + rect.width / 2, x: '-50%' }
  }

  const contentAnimation = {
    animate: contentControls,
    initial: { opacity: 0 }
  }

  return (
    <motion.div className="relative">
      <motion.div ref={ref} { ...contentAnimation }>
        { children }
      </motion.div>
      <AnimatePresence>
        { loading && (
          <motion.div key="loader" { ...loaderAnimation }>
            <DuelyLogo { ...{ svgAnimation, pathAnimation } } />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SpinnerLoader;
