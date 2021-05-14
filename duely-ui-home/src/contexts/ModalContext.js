import React, { createContext, useState } from 'react';
import { Transition } from '@headlessui/react';
import { usePrevious } from '~/hooks';

const Modal = ({ children, dismissable, hideModal, ...props }) => {
  const show = React.Children.count(children) > 0;
  const leavingChildren = usePrevious(children, { retain: true });

  return (
    <Transition
      show={show}
      enter="transition ease-out duration-200"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-100 pointer-events-none"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      {(ref) => (
        <div
          ref={ref}
          className="fixed top-0 left-0 z-30 flex items-center justify-center w-full h-full bg-gray-100 bg-opacity-75 bg-blur"
          {...props}
          onClick={() => dismissable && hideModal()}
        >
          <div
            className="box-border relative flex flex-col p-6 bg-white rounded-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {dismissable && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                onClick={hideModal}
                className="absolute top-0 right-0 w-5 h-5 m-3 text-2xl text-gray-600"
              ></svg>
            )}
            {children ?? leavingChildren}
          </div>
        </div>
      )}
    </Transition>
  );
};

export const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const [modalElementsMap, setModalElementsMap] = useState(new Map());
  const [element, { navigationAction, ...options } = {}] =
    modalElementsMap.entries().next()?.value ?? [];
  // const { route } = useTerminalRoute();

  // const handleNavigation = () => {
  //   for (const { navigationAction, hideModal } of modalElementsMap.values()) {
  //     switch (navigationAction) {

  //       case 'block':
  //         throw new Error('Navigation not allowed');

  //       case 'persist':
  //         return;

  //       case 'dismiss':
  //       default:
  //         hideModal();
  //         break;
  //     }
  //   }
  // }

  // useRouteEvent('beforeExit', handleNavigation, route);

  return (
    <ModalContext.Provider value={setModalElementsMap}>
      <Modal {...options}>{element}</Modal>
      {children}
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
