import { Transition } from '@headlessui/react';
import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { icons } from '../components/icons';
import { useTemporaryValue } from '../hooks/useTemporaryValue';
import { usePrevious } from '../hooks/usePrevious';
import { ScreenOverlayContext } from './ScreenOverlayContext';

export const MessageContext = createContext<null | UseMessageReturn>(null);

type Props = {
  children: React.ReactNode;
};

export function MessageContextProvider({ children }: Props) {
  const {
    value: message,
    setValue: showMessage,
    reset: hideMessage
  } = useTemporaryValue<React.ReactNode>(4000);

  const value = useMemo(
    () => ({ message, showMessage, hideMessage }),
    [message, showMessage, hideMessage]
  );

  const leavingMessage = usePrevious(message, { retain: true });

  const screenOverlayRef = useContext(ScreenOverlayContext);
  if (!screenOverlayRef?.current) return null;

  const dismissable = true;

  return (
    <MessageContext.Provider value={value}>
      {children}
      {ReactDOM.createPortal(
        <Transition
          show={!!message}
          enter="transition ease-out duration-100"
          enterFrom="transform translate-y-12 opacity-0 scale-95"
          enterTo="transform opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform translate-y-12 opacity-0 scale-95"
          className="grid w-full h-full origin-bottom place-items-center"
        >
          <div className="box-border fixed bottom-0 z-40 flex items-center justify-center py-3 pl-4 pr-10 mb-4 text-sm font-medium tracking-wide text-white translate-x-1/2 bg-gray-600 rounded-md shadow-lg pointer-events-auto ring-1 ring-black/5 right-1/2">
            {dismissable && (
              <button
                type="button"
                onClick={hideMessage}
                className="absolute top-0 right-0 m-2.5 text-sm text-gray-400 cursor-default hover:text-gray-100"
              >
                {icons['x.solid']}
              </button>
            )}
            {message ?? leavingMessage}
          </div>
        </Transition>,
        screenOverlayRef.current
      )}
    </MessageContext.Provider>
  );
}

export type UseMessageReturn = {
  message: React.ReactNode;
  showMessage: (message: React.ReactNode) => void;
  hideMessage: () => void;
};
