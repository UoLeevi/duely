import React, { createContext, useState } from 'react';
import { useBlocker } from 'react-router-dom'
import Modal from 'components/Modal';

export const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const [modalElementsMap, setModalElementsMap] = useState(new Map());
  const [element, { navigationAction, ...options } = {}] = modalElementsMap.entries().next()?.value ?? [];

  function handleNavigation({ retry: navigate }) {
    for (const { navigationAction, hideModal } of modalElementsMap.values()) {
      switch (navigationAction) {

        case 'block':
          return;

        case 'persist':
          navigate();
          return;

        case 'dismiss':
        default:
          hideModal();
          break;
      }
    }

    navigate();
  }

  useBlocker(handleNavigation, element);

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
