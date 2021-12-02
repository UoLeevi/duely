import React from 'react';
import { createClassName } from '@duely/util';
import { getIconElement, IconProp, icons } from '../icons';
import { LoadingSpinner } from '../LoadingSpinner';
import { Animation } from '..';

export type ButtonBaseProps = {
  loading?: boolean;
  disabled?: boolean;
  shrink?: boolean;
  dense?: boolean;
  color?: keyof typeof colorClassName;
  children?: React.ReactNode;
  className?: string;
  icon?: IconProp;
};

export type ElementPropsWithoutRef<T extends React.ElementType> = Pick<
  React.ComponentPropsWithoutRef<T>,
  keyof React.ComponentPropsWithoutRef<T>
>;

type BaseComponent<T extends React.ElementType> = {
  render: T;
};

const colorClassName = {
  gray: 'text-gray-600 dark:text-white bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-500',
  indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white dark:border-gray-600',
  red: 'bg-red-600 hover:bg-red-700 text-white dark:border-gray-700',
  green: 'bg-green-600 hover:bg-green-700 text-white dark:border-gray-700',
  white: 'bg-white hover:bg-gray-50 text-black'
} as const;

export function ButtonBase<T extends React.ElementType = 'button'>({
  children,
  disabled,
  loading,
  dense,
  shrink,
  color,
  className,
  render,
  icon,
  ...props
}: ButtonBaseProps &
  BaseComponent<T> &
  Omit<ElementPropsWithoutRef<T>, keyof (ButtonBaseProps & BaseComponent<T>)>) {
  disabled = !!(disabled || loading);
  color = color ?? 'gray';
  className = createClassName(
    'relative flex justify-center tracking-wide whitespace-nowrap items-center border appearance-none rounded-md text-md font-medium transition duration-150 ease-in-out focus:outline-none focus-visible:outline-none focus-visible:ring shadow-sm',
    dense ? 'px-4 py-1.5' : 'px-7 py-2.5',
    !shrink && (dense ? 'min-w-[10ch]' : 'min-w-[12ch]'),
    !loading && 'disabled:opacity-50',
    color && colorClassName[color],
    className
  );

  const Component: React.ElementType = render;

  icon = getIconElement(icon);

  if (icon) {
    return (
      <Component disabled={disabled} className={className} {...props}>
        <span className="flex items-center space-x-2">
          <Animation.Fade>
            {loading ? (
              <LoadingSpinner loading={loading} className="!text-current w-[1.25em] h-[1.25em]" />
            ) : (
              icon
            )}
          </Animation.Fade>
          {children && <span>{children}</span>}
        </span>
      </Component>
    );
  } else {
    return (
      <Component disabled={disabled} className={className} {...props}>
        <LoadingSpinner
          loading={loading}
          className={`!text-current absolute w-[1.25em] h-[1.25em] left-0 ${
            dense ? 'ml-2' : 'ml-3'
          }`}
        />

        <span
          className={createClassName(
            'transform transition-transform flex items-center',
            loading && 'translate-x-4'
          )}
        >
          {children && <span>{children}</span>}
        </span>

        {loading && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: 'inherit',
              backgroundColor: 'inherit',
              maskImage:
                'linear-gradient(to left, rgba(0, 0, 0, 1.0), rgba(0, 0, 0, 1.0) 0.25rem, rgba(0, 0, 0, 0.0) 1.25rem, rgba(0, 0, 0, 0.0))',
              WebkitMaskImage:
                'linear-gradient(to left, rgba(0, 0, 0, 1.0), rgba(0, 0, 0, 1.0) 0.25rem, rgba(0, 0, 0, 0.0) 1.25rem, rgba(0, 0, 0, 0.0))'
            }}
          ></div>
        )}
      </Component>
    );
  }
}
