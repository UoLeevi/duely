import React, { createContext, useState, useLayoutEffect } from 'react';
import Modal from 'components/Modal';

export const ModalContext = createContext();

const defaultOptions = {
  show: false,
  dismissable: true
};

const ModalContextProvider = ({ children }) => {
  const [modalContentsMap, setModalContentsMap] = useState(new Map());

  function useModal(renderContent, { props, options } = { props: {}, options: {} }) {

    const hideModal = () => {
      const newMap = new Map(modalContentsMap);
      newMap.delete(renderContent);
      setModalContentsMap(newMap);
    }

    const Content = () => {
      return (
        <>
          { renderContent({ ...props, hideModal }) }
        </>
      );
    }

    options = { ...defaultOptions, ...options, hideModal };

    const showModal = () => {
      if (modalContentsMap.has(renderContent)) {
        return;
      }

      const newMap = new Map([[renderContent, { Content, options }], ...modalContentsMap.entries()]);
      setModalContentsMap(newMap);
    }

    const initialize = () => { options.show && showModal(); }
    useLayoutEffect(initialize, []);

    return [showModal, hideModal];
  }

  const { value: { Content, options } = { Content: null, options: {} } } = modalContentsMap.values().next();

  return (
    <ModalContext.Provider value={{ useModal }}>
      <Modal { ...options }>
        { Content &&
          <Content />
        }
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
