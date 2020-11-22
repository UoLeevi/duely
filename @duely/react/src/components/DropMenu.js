import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Transition } from '@headlessui/react';

function DropMenuItems({ children, close, buttonRef }) {
  const ref = useRef();

  useEffect(() => ref.current.focus(), []);

  function onBlur(e) {
    const container = ref.current;
    const focusedEl = e.relatedTarget;
    if (focusedEl === buttonRef.current)
      return;
    if (!focusedEl || !container.contains(focusedEl)) {
      close();
    }
  }

  return (
    <div ref={ref} tabIndex="-1" className="z-10 absolute right-0 flex flex-col space-y-2 bg-white px-4 py-2 rounded-md border shadow-md focus:outline-none" onBlur={onBlur}>
      {children}
    </div>
  );
}

export function DropMenu({ children, button }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  function open() {
    setIsOpen(isOpen => !isOpen);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button ref={ref} type="button" onClick={open} className="focus:outline-none">
        {button ?? <BsThreeDotsVertical className="text-xl text-gray-500" />}
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
