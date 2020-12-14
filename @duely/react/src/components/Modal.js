import React, { useContext, useEffect, useRef } from 'react';
import { Util } from '../util';
import { ScreenOverlayContext } from '../contexts';
import ReactDOM from 'react-dom';
import { Transition } from '@headlessui/react';

function ModalContent({ children, close, openerRef, className }) {
  const ref = useRef();

  useEffect(() => ref.current.focus(), []);

  function onBlur(e) {
    const container = ref.current;
    const focusedEl = e.relatedTarget;
    if (focusedEl === openerRef?.current)
      return;
    if (!focusedEl || !container.contains(focusedEl)) {
      close?.();
    }
  }

  className = Util.createClassName(className, 'flex flex-col relative shadow-lg box-border focus:outline-none');

  return (
    <div ref={ref} tabIndex="-1" className={className} onClick={e => e.stopPropagation()} onBlur={onBlur}>
      {/* {close && <BsX onClick={close} className="absolute top-0 right-0 m-3 text-2xl text-gray-600" />} */}
      {children}
    </div>
  );
}

export function Modal({ children, show, close, openerRef, className }) {
  const screenOverlayRef = useContext(ScreenOverlayContext);

  const backdropStyle = {
    width: '110%',
    height: '110%'
  };

  return ReactDOM.createPortal(
    <Transition
      show={show}
      enter="transition ease-out duration-75"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
      className="grid w-full h-full place-items-center"
    >
      <div style={backdropStyle} className="z-30 flex items-center justify-center bg-gray-100 bg-opacity-75 pointer-events-auto bg-blur">
        <ModalContent openerRef={openerRef} close={close} className={className}>
          {children}
        </ModalContent>
      </div>
    </Transition>,
    screenOverlayRef.current
  );
}
