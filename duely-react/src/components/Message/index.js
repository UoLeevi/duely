import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Message.css';
import CloseButton from 'components/CloseButton';

const messageAnimations = {
  initial: {
    opacity: 0,
    scale: 0.9,
    x: '110%',
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: '0',
    transition: {
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
}

const Message = ({ children, dismissable, hideMessage, autoHideMs, ...props }) => {
  useEffect(() => {
    if (!autoHideMs) return;
    const timeoutId = setTimeout(hideMessage, autoHideMs);
    return () => clearTimeout(timeoutId);
  }, [autoHideMs, hideMessage]);

  return (
    <AnimatePresence exitBeforeEnter>
      { children && (
        <motion.div className="message-box" data-bg="l9"
          variants={ messageAnimations }
          initial="initial"
          animate="animate"
          exit="exit"
        >
          { dismissable && <CloseButton onClick={ hideMessage } size="0.9rem" className="pa-3" /> }
          { children }
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Message;
