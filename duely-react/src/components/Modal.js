import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';
import ModalBackground from './ModalBackground';
import { hidden, visible } from '../animations';

const backdropAnimations = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.16
    }
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
