import React from 'react';
import { useBlocker } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';
import CloseButton from '../CloseButton';
import AnimatedTransition from 'components/AnimatedTransition';

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
    opacity: 0,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.1
    }
  }
}

const didChildKeyChange = (previous, next) => {
  return previous.key !== next.key;
};

const Modal = ({ children, dismissable, hideModal, navigationAction, ...props }) => {
  function handleNavigation({ retry: navigate }) {
    switch (navigationAction) {
      case 'block':
        break;

      case 'persist':
        navigate();
        break;

      case 'dismiss':
      default:
        hideModal();
        navigate();
        break;
    }
  }

  useBlocker(handleNavigation, !!children);

  return (
    <AnimatePresence exitBeforeEnter>
      { children && (
        <motion.div className="modal-backdrop"
          variants={ backdropAnimations }
          initial="initial"
          animate="animate"
          exit="exit"
          { ...props }
        >
          <AnimatePresence exitBeforeEnter>
            <motion.div className="modal panel"
              variants={ panelAnimations }
            >
              { dismissable && <CloseButton onClick={ hideModal } /> }
              <AnimatedTransition shouldTransition={ didChildKeyChange }>
                { children }
              </AnimatedTransition>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
