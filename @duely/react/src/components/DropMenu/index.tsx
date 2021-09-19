import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { Transition, Menu } from '@headlessui/react';
import { createClassName } from '@duely/util';
import { ElementType } from 'react';
import { IconProp } from '../icons';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../../hooks';
import { SkeletonText } from '../skeletons';

type ButtonProps = {
  as?: ElementType;
  children?: React.ReactNode;
};

function DropMenuButton({ children, as }: ButtonProps) {
  return (
    <Menu.Button as={as}>
      {children ?? (
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
    </Menu.Button>
  );
}

type ItemProps = {
  icon?: IconProp;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
} & Partial<React.ComponentProps<Link>>;

function DropMenuItem({ icon, children, to, href, loading, onClick, ...props }: ItemProps) {
  const createClassName2 = ({ active, disabled }: { active: boolean; disabled: boolean }) =>
    createClassName(
      active ? 'bg-gray-100 dark:text-gray-100 text-gray-900' : 'dark:text-gray-300 text-gray-700',
      'group first:rounded-t-md last:rounded-b-md flex px-4 py-2 items-center space-x-2 whitespace-nowrap text-sm text-center focus:outline-none font-medium'
    );

  return (
    <Menu.Item>
      {(arg) =>
        loading ? (
          <span className={createClassName2(arg)}>
            {icon}
            <span className="flex items-center flex-1 space-x-2 animate-pulse">Loading...</span>
          </span>
        ) : href ? (
          <a
            className={createClassName2(arg)}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            {...props}
          >
            {icon}
            <span className="flex items-center flex-1 space-x-2">{children}</span>
          </a>
        ) : to ? (
          <Link className={createClassName2(arg)} to={to} onClick={onClick} {...props}>
            {icon}
            <span className="flex items-center flex-1 space-x-2">{children}</span>
          </Link>
        ) : (
          <button className={createClassName2(arg)} onClick={onClick}>
            {icon}
            <span className="flex items-center flex-1 space-x-2">{children}</span>
          </button>
        )
      }
    </Menu.Item>
  );
}

export const DropMenu = Object.assign(DropMenuRoot, {
  Button: DropMenuButton,
  Item: DropMenuItem
});

type DropMenuProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  'no-button'?: boolean;
  open?: boolean;
};

export function DropMenuRoot({ children, ...props }: DropMenuProps) {
  const childrenArray = React.Children.toArray(children);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsClassNamesRef = useRef<string>('-bottom-2 left-0 origin-top-left translate-y-full');

  const button = props['no-button']
    ? null
    : childrenArray.find((child: any) => child.type === DropMenuButton) ?? <DropMenuButton />;

  const items = childrenArray.filter((child) => child !== button);

  const intersectionObserverCallback = useCallback<Parameters<typeof useIntersectionObserver>[1]>(
    (entry) => {
      const itemHeight = 40;
      const itemWidth = 250;

      const down =
        (entry.rootBounds?.height ?? Number.POSITIVE_INFINITY) - entry.intersectionRect.top >
          items.length * itemHeight ||
        entry.intersectionRect.top < (entry.rootBounds?.height ?? 0) / 2;

      const right =
        (entry.rootBounds?.width ?? Number.POSITIVE_INFINITY) - entry.intersectionRect.left >
          itemWidth || entry.intersectionRect.left < (entry.rootBounds?.width ?? 0) / 2;

      itemsClassNamesRef.current =
        down && right
          ? '-bottom-2 left-0 origin-top-left translate-y-full'
          : down
          ? '-bottom-2 right-0 origin-top-right translate-y-full'
          : right
          ? '-top-2 left-0 origin-bottom-left -translate-y-full'
          : '-top-2 right-0 origin-bottom-right -translate-y-full';
    },
    [items.length]
  );

  useIntersectionObserver(menuRef, intersectionObserverCallback);

  return (
    <Menu as="div" className="relative inline-block">
      {({ open }) => {
        open = props.open ?? open;

        return (
          <>
            <div
              ref={menuRef}
              className="absolute z-0 w-0 h-0 pointer-events-none left-1/2 top-1/2"
            ></div>

            {button}

            <Transition
              show={open}
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Menu.Items
                static
                className={`transform absolute z-20 flex flex-col w-56 min-w-min bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${itemsClassNamesRef.current}`}
              >
                {items}
              </Menu.Items>
            </Transition>
          </>
        );
      }}
    </Menu>
  );
}
