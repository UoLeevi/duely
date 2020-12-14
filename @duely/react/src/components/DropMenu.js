import React, { useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';

function DropMenuItems({ children, close, buttonRef }) {
  const ref = useRef();

  useEffect(() => ref.current.focus(), []);

  function onBlur(e) {
    const container = ref.current;
    const focusedEl = e.relatedTarget;
    if (focusedEl === buttonRef.current) return;
    if (!focusedEl || !container.contains(focusedEl)) {
      close();
    }
  }

  return (
    <div
      ref={ref}
      tabIndex="-1"
      className="absolute right-0 z-10 flex flex-col px-4 py-2 space-y-2 bg-white border rounded-md shadow-md focus:outline-none"
      onBlur={onBlur}
    >
      {children}
    </div>
  );
}

export function DropMenu({ children, button }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  function open() {
    setIsOpen((isOpen) => !isOpen);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button ref={ref} type="button" onClick={open} className="focus:outline-none">
        {button ?? (
          <svg
            className="text-xl text-gray-500"
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
        <DropMenuItems buttonRef={ref} close={close}>
          {children}
        </DropMenuItems>
      </Transition>
    </div>
  );
}
