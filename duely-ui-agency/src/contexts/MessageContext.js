import React, { createContext, useEffect, useState } from 'react';
import { BsX } from 'react-icons/bs';
import { Transition } from '@headlessui/react';
import { usePrevious } from 'hooks';

const Message = ({ children, dismissable, hideMessage, autoHideMs, ...props }) => {
  useEffect(() => {
    if (!autoHideMs) return;
    const timeoutId = setTimeout(hideMessage, autoHideMs);
    return () => clearTimeout(timeoutId);
  }, [autoHideMs, hideMessage]);

  const show = React.Children.count(children) > 0;
  const leavingChildren = usePrevious(children, { retain: true });

  return (
    <Transition
      show={show}
      enter="transition ease-out duration-200 delay-300"
      enterFrom="transform opacity-0 scale-95 translate-x-8"
      enterTo="transform opacity-100 scale-100 translate-x-0"
      leave="transition ease-in duration-100 pointer-events-none"
      leaveFrom="transform opacity-100 scale-100 translate-x-0"
      leaveTo="transform opacity-0 scale-95 translate-x-8"
    >
      { ref => (
        <div ref={ref} className="border border-gray-100 fixed right-0 bottom-0 m-4 z-40 flex flex-col items-center justify-center bg-white rounded-md box-border shadow-lg p-4 pr-10">
          { dismissable && <BsX onClick={hideMessage} className="absolute right-0 top-0 text-xl m-2 text-gray-600" /> }
          { children ?? leavingChildren }
        </div>
      )}
    </Transition>
  );
};

export const MessageContext = createContext();

export default function MessageContextProvider({ children }) {
  const [messageElementsMap, setMessageElementsMap] = useState(new Map());
  const [element, { navigationAction, ...options } = {}] = messageElementsMap.entries().next()?.value ?? [];
  // const { route } = useTerminalRoute();

  // const handleNavigation = () => {
  //   for (const { navigationAction, hideMessage } of messageElementsMap.values()) {
  //     switch (navigationAction) {

  //       case 'block':
  //         throw new Error('Navigation not allowed');

  //       case 'persist':
  //         return;

  //       case 'dismiss':
  //       default:
  //         hideMessage();
  //         break;
  //     }
  //   }
  // };

  // useRouteEvent('beforeExit', handleNavigation, route);

  return (
    <MessageContext.Provider value={setMessageElementsMap}>
      <Message {...options}>
        {element}
      </Message>
      { children}
    </MessageContext.Provider>
  );
}

export function withMessageContext(Fn) {
  return (
    <MessageContextProvider>
      <Fn />
    </MessageContextProvider>
  );
}
