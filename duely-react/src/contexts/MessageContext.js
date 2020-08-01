import React, { createContext, useState } from 'react';
import useTerminalRoute from 'hooks/useTerminalRoute';
import useRouteEvent from 'hooks/useRouteEvent';
import Message from 'components/Message';

export const MessageContext = createContext();

const MessageContextProvider = ({ children }) => {
  const [messageElementsMap, setMessageElementsMap] = useState(new Map());
  const [element, { navigationAction, ...options } = {}] = messageElementsMap.entries().next()?.value ?? [];
  const { route } = useTerminalRoute();

  const handleNavigation = () => {
    for (const { navigationAction, hideMessage } of messageElementsMap.values()) {
      switch (navigationAction) {

        case 'block':
          throw new Error('Navigation not allowed');

        case 'persist':
          return;

        case 'dismiss':
        default:
          hideMessage();
          break;
      }
    }
  }

  useRouteEvent('beforeExit', handleNavigation, route);

  return (
    <MessageContext.Provider value={ setMessageElementsMap }>
      <Message { ...options }>
        { element }
      </Message>
      { children }
    </MessageContext.Provider>
  );
};

export function withMessageContext(Fn) {
  return (
    <MessageContextProvider>
      <Fn />
    </MessageContextProvider>
  );
}

export default MessageContextProvider;
