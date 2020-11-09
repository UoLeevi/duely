import { useContext, useLayoutEffect, useCallback } from 'react';
import { ModalContext } from 'contexts/ModalContext';

const defaultOptions = {
  show: false,
  dismissable: true,
  navigationAction: 'dismiss' // or 'block' or 'persist'
};

export default function useModal(element, { hideModalRef, ...options } = {}) {
  const setModalElementsMap = useContext(ModalContext);
  options = { ...defaultOptions, ...options };

  const showModal = useCallback(() => {
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
  }, [element, hideModalRef, options, setModalElementsMap]);

  const initialize = () => { options.show && showModal(); }
  useLayoutEffect(initialize, [options.show, showModal]);

  return showModal;
}
