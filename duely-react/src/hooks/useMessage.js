import { useContext, useLayoutEffect } from 'react';
import { MessageContext } from 'contexts/MessageContext';

const defaultOptions = {
  show: false,
  dismissable: true,
  navigationAction: 'dismiss' // or 'block' or 'persist'
};

export default function useMessage(element, { hideMessageRef, ...options } = {}) {
  const setMessageElementsMap = useContext(MessageContext);
  options = { ...defaultOptions, ...options };

  const showMessage = () => {
    const hideMessage = () => {
      setMessageElementsMap(messageElementsMap => {
        const newMap = new Map(messageElementsMap);
        newMap.delete(element);
        return newMap;
      });
    }

    if (hideMessageRef && 'current' in hideMessageRef) {
      hideMessageRef.current = hideMessage;
    }

    setMessageElementsMap(messageElementsMap => {
      return new Map([[element, { hideMessage, ...options }], ...messageElementsMap.entries()]);
    });
  }

  const initialize = () => { options.show && showMessage(); }
  useLayoutEffect(initialize, []);

  return showMessage;
}
