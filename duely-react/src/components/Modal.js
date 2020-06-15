import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';
import { hidden, visible } from '../animations';

const Modal = ({ children }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      { children.length !== 0 && (
        <motion.div className="modal-backdrop"
          initial={ hidden }
          animate={ visible }
          exit={ hidden }
        >
          { children }
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
