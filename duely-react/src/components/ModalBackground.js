import React from 'react';
import './ModalBackground.css';

const ModalBackground = ({ children }) => {
  return (
    <div className="modal-background">
      { children }
    </div>
  )
};

export default ModalBackground;
