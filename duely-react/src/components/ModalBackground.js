import React from 'react';
import './ModalBackground.css';

const ModalBackground = ({ children }) => {
  return (
    <div className="modal-background panel">
      { children }
    </div>
  )
};

export default ModalBackground;
