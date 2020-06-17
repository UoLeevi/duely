import React, { createContext, useState, useLayoutEffect } from 'react';
import Modal from '../components/Modal';

export const ModalContext = createContext();

const defaultOptions = {
  show: false,
  hideable: true // <- not yet implemented
};

const ModalContextProvider = ({ children }) => {

  const [modalContentsMap, setModalContentsMap] = useState(new Map());

  function useModal(renderContent, { props, options } = { props: {}, options: {} }) {
    options = { ...defaultOptions, ...options }

    const hideModal = () => {
      const newMap = new Map(modalContentsMap);
      newMap.delete(renderContent);
      setModalContentsMap(newMap);
    }

    const showModal = () => {
      if (modalContentsMap.has(renderContent)) {
        return;
      }

      const newMap = new Map(modalContentsMap);
      newMap.set(renderContent, renderContent({ ...props, hideModal }))
      setModalContentsMap(newMap);
    }

    const initialize = () => { options.show && showModal(); }
    useLayoutEffect(initialize, []);

    return [showModal, hideModal];
  }

  return (
    <ModalContext.Provider value={{ useModal }}>
      <Modal>
        { Array.from(modalContentsMap.values()) }
      </Modal>
      { children }
    </ModalContext.Provider>
  );
}

export default ModalContextProvider;
