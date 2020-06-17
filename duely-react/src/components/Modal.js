import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';
import ModalBackground from './ModalBackground';

const backdropAnimations = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1
  },
  exit: {
    opacity: 0
  },
  transition: {
    duration: 0.2
  }
}

const Modal = ({ children }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      { children.length !== 0 && (
        <motion.div className="modal-backdrop"
          { ...backdropAnimations }
        >
          <ModalBackground>
            { children }
          </ModalBackground>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
