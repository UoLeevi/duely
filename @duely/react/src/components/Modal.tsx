import React, { useContext, useEffect, useRef } from 'react';
import { Util } from '../util';
import { ScreenOverlayContext } from '../contexts';
import ReactDOM from 'react-dom';
import { Transition } from '@headlessui/react';

type ModalProps = {
  children: React.ReactNode;
  show: boolean;
  close?: () => void;
  openerRef?: React.RefObject<Node>;
  className?: string;
};

export function Modal({ children, show, close, openerRef, className }: ModalProps) {
  const screenOverlayRef = useContext(ScreenOverlayContext);
  if (!screenOverlayRef?.current) return null;

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
      <div
        style={backdropStyle}
        className="z-30 flex items-center justify-center bg-gray-100 bg-opacity-75 pointer-events-auto bg-blur"
      >
        <ModalContent openerRef={openerRef} close={close} className={className}>
          {children}
        </ModalContent>
      </div>
    </Transition>,
    screenOverlayRef.current
  );
}

type ModalContentProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  close?: () => void;
  openerRef?: React.RefObject<Node>;
};

function ModalContent({ children, close, openerRef, className }: ModalContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => ref.current?.focus(), []);

  function onBlur(e: React.FocusEvent) {
    const container = ref.current;
    const focusedEl = e.relatedTarget as Node;
    if (focusedEl === openerRef?.current) return;
    if (!focusedEl || !container?.contains(focusedEl)) {
      close?.();
    }
  }

  className = Util.createClassName(
    className,
    'box-border relative flex flex-col shadow-lg focus:outline-none'
  );

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={className}
      onClick={(e) => e.stopPropagation()}
      onBlur={onBlur}
    >
      {/* {close && <BsX onClick={close} className="absolute top-0 right-0 m-3 text-2xl text-gray-600" />} */}
      {children}
    </div>
  );
}
