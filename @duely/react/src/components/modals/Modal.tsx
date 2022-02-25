import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ScreenOverlayContext } from '../../contexts';
import ReactDOM from 'react-dom';
import { Transition } from '@headlessui/react';
import { getIconElement, IconProp, icons } from '../icons';
import { usePrevious } from '../../hooks/usePrevious';
import { createClassName } from '@duely/util';

export type UseModalReturn = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  control: UseModalReturn;
};

export function useModal(initialIsOpen: boolean): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const control: Partial<UseModalReturn> = {
    isOpen,
    open,
    close
  };

  control.control = control as UseModalReturn;

  return control as UseModalReturn;
}

type ModalProps = {
  children: React.ReactNode;
  control: UseModalReturn;
  openerRef?: React.RefObject<Node>;
  className?: string;
  dismissable?: boolean;
  unstyled?: boolean;
};

function ModalRoot({ children, control, openerRef, className, dismissable, unstyled }: ModalProps) {
  const screenOverlayRef = useContext(ScreenOverlayContext);
  if (!screenOverlayRef?.current) return null;

  const backdropStyle = {
    width: '110%',
    height: '110%'
  };

  const leavingChildren = usePrevious(children, { retain: true });

  return ReactDOM.createPortal(
    <Transition
      show={control.isOpen}
      enter="transition ease-out duration-75"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
      className="grid w-full h-full origin-center place-items-center"
    >
      <div
        style={backdropStyle}
        className="z-40 flex items-center justify-center bg-gray-100 bg-opacity-75 pointer-events-auto bg-blur"
      >
        <ModalContent
          openerRef={openerRef}
          control={control}
          className={className}
          dismissable={dismissable}
          unstyled={unstyled}
        >
          {children ?? leavingChildren}
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
  control: UseModalReturn;
  openerRef?: React.RefObject<Node>;
  dismissable?: boolean;
  unstyled?: boolean;
};

function ModalContent({
  children,
  control,
  openerRef,
  className,
  dismissable,
  unstyled
}: ModalContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!control.isOpen) return;

    const body = document.documentElement;
    const overflow = body.style.overflow;
    const paddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - body.clientWidth;

    body.style.overflow = 'hidden';
    body.style.paddingRight = `${scrollbarWidth}px`;

    ref.current?.focus();

    return () => {
      body.style.overflow = overflow;
      body.style.paddingRight = paddingRight;
    };
  }, [control.isOpen]);

  function onBlur(e: React.FocusEvent) {
    if (!dismissable) return;
    const container = ref.current;
    const focusedEl = e.relatedTarget as Node;
    if (focusedEl === openerRef?.current) return;
    if (!focusedEl || !container?.contains(focusedEl)) {
      control.close?.();
    }
  }

  className = createClassName(
    !unstyled && 'max-w-lg rounded-lg',
    className,
    'box-border relative flex flex-col shadow-lg focus:outline-none ring-1 ring-black ring-opacity-5'
  );

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={className}
      onClick={(e) => e.stopPropagation()}
      onBlur={onBlur}
    >
      {dismissable && (
        <span
          onClick={control.close}
          className="absolute top-0 right-0 m-3 text-2xl text-gray-600 cursor-default"
        >
          {icons['x.solid']}
        </span>
      )}
      {children}
    </div>
  );
}

type ModalBodyProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  heading?: React.ReactNode;
  icon?: IconProp;
  iconClassNames?: string;
};

function Body({ children, heading, icon, className, iconClassNames }: ModalBodyProps) {
  icon = getIconElement(icon);
  className = createClassName('flex p-6 space-x-4 bg-white rounded-t-lg', className);

  return (
    <div className={className}>
      {icon && (
        <div
          className={`grid w-10 h-10 text-xl rounded-full place-items-center ${
            iconClassNames ?? ''
          }`}
        >
          {icon}
        </div>
      )}

      <div className="flex flex-col flex-1 space-y-4 w-96 min-w-min">
        {heading && <h3 className="text-xl font-medium border-b border-black/[.075] pb-3">{heading}</h3>}

        {children}
      </div>
    </div>
  );
}

type ModalFooterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

function Footer({ children, className }: ModalFooterProps) {
  className = createClassName(
    'flex flex-row-reverse px-6 py-4 space-x-4 space-x-reverse text-sm font-medium text-white rounded-b-lg bg-gray-50',
    className
  );
  return <div className={className}>{children}</div>;
}

export const Modal = Object.assign(ModalRoot, { Body, Footer });
