import React from 'react';
import { Util } from '../../util';
import { LoadingSpinner } from '../LoadingSpinner';

export type ButtonBaseProps = {
  spinner?: boolean;
  loading?: boolean;
  disabled?: boolean;
  dense?: boolean;
  color?: keyof typeof colorClassName;
  children: React.ReactNode;
  className?: string;
};

export type ElementPropsWithoutRef<T extends React.ElementType> = Pick<
  React.ComponentPropsWithoutRef<T>,
  keyof React.ComponentPropsWithoutRef<T>
>;

type BaseComponent<T extends React.ElementType> = {
  render: T;
};

const colorClassName = {
  gray: 'text-gray-600 bg-gray-50 hover:bg-gray-100 border-gray-300',
  indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  red: 'bg-red-600 hover:bg-red-700 text-white',
  green: 'bg-green-600 hover:bg-green-700 text-white'
};

export function ButtonBase<T extends React.ElementType = 'button'>({
  children,
  disabled,
  loading,
  spinner,
  dense,
  color,
  className,
  render,
  ...props
}: ButtonBaseProps &
  BaseComponent<T> &
  Omit<ElementPropsWithoutRef<T>, keyof (ButtonBaseProps & BaseComponent<T>)>) {
  spinner = spinner || loading;
  disabled = !!(disabled || loading);
  className = Util.createClassName(
    'relative flex justify-center tracking-wide whitespace-nowrap items-center border appearance-none rounded-md text-md font-medium transition duration-150 ease-in-out focus:outline-none focus-visible:outline-none focus-visible:ring shadow-sm',
    spinner ? (dense ? 'px-9 py-1.5' : 'px-12 py-2.5') : dense ? 'px-4 py-1.5' : 'px-7 py-2.5',
    !loading && 'disabled:opacity-50',
    color && colorClassName[color],
    className
  );

  const Component: React.ElementType = render;

  return (
    <Component disabled={disabled} className={className} {...props}>
      {spinner && (
        <LoadingSpinner
          loading={loading}
          className={`absolute left-0 ${dense ? 'h-5 ml-2' : 'h-6 ml-3'}`}
        />
      )}
      {children}
    </Component>
  );
}
