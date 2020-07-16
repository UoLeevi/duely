import { useContext, useLayoutEffect } from 'react';
import { ModalContext } from 'contexts/ModalContext';

const defaultOptions = {
  show: false,
  dismissable: true,
  navigationAction: 'dismiss' // or 'block' or 'persist'
};

export default function useModal(element, { hideModalRef, ...options } = {}) {
  const setModalElementsMap = useContext(ModalContext);
  options = { ...defaultOptions, ...options };

  const showModal = () => {
    const hideModal = () => {
      setModalElementsMap(modalElementsMap => {
        const newMap = new Map(modalElementsMap);
        newMap.delete(element);
        return newMap;
      });
    }

    if (hideModalRef && 'current' in hideModalRef) {
      hideModalRef.current = hideModal;
    }

    setModalElementsMap(modalElementsMap => {
      return new Map([[element, { hideModal, ...options }], ...modalElementsMap.entries()]);
    });
  }

  const initialize = () => { options.show && showModal(); }
  useLayoutEffect(initialize, []);

  return showModal;
}
