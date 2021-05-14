import React, { createContext, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { usePrevious } from '~/hooks';

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
      {(ref) => (
        <div
          ref={ref}
          className="box-border fixed bottom-0 right-0 z-40 flex flex-col items-center justify-center p-4 pr-10 m-4 bg-white border border-gray-100 rounded-md shadow-lg"
        >
          {dismissable && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={hideMessage}
              className="h-[1em] w-[1em] absolute right-0 top-0 text-xl m-2 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {children ?? leavingChildren}
        </div>
      )}
    </Transition>
  );
};

export const MessageContext = createContext();

export default function MessageContextProvider({ children }) {
  const [messageElementsMap, setMessageElementsMap] = useState(new Map());
  const [element, { navigationAction, ...options } = {}] =
    messageElementsMap.entries().next()?.value ?? [];
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
      <Message {...options}>{element}</Message>
      {children}
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
