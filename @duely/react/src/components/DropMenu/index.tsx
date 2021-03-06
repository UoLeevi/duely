import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { Util } from '../../util';

export function useDropMenu() {
  const control = useRef<undefined | { open: () => void; close: () => void }>();
  return useMemo(
    () => ({
      open: () => control.current?.open(),
      close: () => control.current?.close(),
      control
    }),
    []
  );
}

type DropMenuProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  button?: React.ReactNode;
  origin?: 'right' | 'left' | 'center';
  control?: ReturnType<typeof useDropMenu>['control'];
};

const originClassNames = {
  right: 'right-0',
  left: 'left-0',
  center: 'left-[50%] -translate-x-1/2'
};

export function DropMenu({ children, button, origin, control }: DropMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  function open() {
    setIsOpen((isOpen) => !isOpen);
  }

  function close() {
    setIsOpen(false);
  }

  if (control) {
    control.current = { open, close };
  }

  return (
    <div className="relative">
      <button ref={ref} type="button" onClick={open} className="focus:outline-none">
        {button ?? (
          <svg
            className="h-6 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        )}
      </button>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-75"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <DropMenuItems buttonRef={ref} close={close} origin={origin}>
          {children}
        </DropMenuItems>
      </Transition>
    </div>
  );
}

type DropMenuItemsProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  close: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  origin?: 'right' | 'left' | 'center';
};

function DropMenuItems({ children, close, buttonRef, origin, ...props }: DropMenuItemsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => ref.current?.focus(), []);

  function onBlur(e: React.FocusEvent<HTMLDivElement>) {
    const container = ref.current;
    const focusedEl = e.relatedTarget as Node;
    if (focusedEl === buttonRef.current) return;
    if (!focusedEl || !container?.contains(focusedEl)) {
      close();
    }
  }

  const className = Util.createClassName(
    originClassNames[origin ?? 'right'],
    'absolute z-20 flex flex-col px-4 py-2 space-y-2 bg-white border rounded-md shadow-md dark:bg-gray-900 dark:border-gray-700 focus:outline-none'
  );

  return (
    <div ref={ref} tabIndex={-1} className={className} onBlur={onBlur} {...props}>
      {children}
    </div>
  );
}
