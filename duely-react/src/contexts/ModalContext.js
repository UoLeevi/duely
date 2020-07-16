import React, { createContext, useState } from 'react';
import Modal from 'components/Modal';

export const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const [modalElementsMap, setModalElementsMap] = useState(new Map());
  const [element, options] = modalElementsMap.entries().next()?.value ?? [];

  return (
    <ModalContext.Provider value={ setModalElementsMap }>
      <Modal { ...options }>
        { element }
      </Modal>
      { children }
    </ModalContext.Provider>
  );
};

export function withModalContext(Fn) {
  return (
    <ModalContextProvider>
      <Fn />
    </ModalContextProvider>
  );
}

export default ModalContextProvider;
