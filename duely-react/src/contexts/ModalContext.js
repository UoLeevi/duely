import React, { createContext, useState } from 'react';
import useTerminalRoute from 'hooks/useTerminalRoute';
import useRouteEvent from 'hooks/useRouteEvent';
import Modal from 'components/Modal';

export const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const [modalElementsMap, setModalElementsMap] = useState(new Map());
  const [element, { navigationAction, ...options } = {}] = modalElementsMap.entries().next()?.value ?? [];
  const { route } = useTerminalRoute();

  const handleNavigation = () => {
    for (const { navigationAction, hideModal } of modalElementsMap.values()) {
      switch (navigationAction) {

        case 'block':
          throw new Error('Navigation not allowed');

        case 'persist':
          return;

        case 'dismiss':
        default:
          hideModal();
          break;
      }
    }
  }

  useRouteEvent('beforeExit', handleNavigation, route);

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
