import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';
import CloseButton from './CloseButton';

const backdropAnimations = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      when: 'beforeChildren'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      when: 'afterChildren'
    }
  }
}

const panelAnimations = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
}

const Modal = ({ children, dismissable, hideModal }) => {

  return (
    <AnimatePresence exitBeforeEnter>
      { children && (
        <motion.div className="modal-backdrop"
          variants={ backdropAnimations }
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <AnimatePresence exitBeforeEnter>
            <motion.div className="modal panel"
              variants={ panelAnimations }
            >
              { dismissable && <CloseButton onClick={ hideModal } /> }
              { children }
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
