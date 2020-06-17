import React, { createContext, useState } from 'react';
import Modal from '../components/Modal';

export const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {

  const [modalContentsMap, setModalContentsMap] = useState(new Map());

  function useModal(renderContent, obj = {}) {

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
      newMap.set(renderContent, renderContent({ ...obj, hideModal }))
      setModalContentsMap(newMap);
    }

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
