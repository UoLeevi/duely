import React, { ElementType } from 'react';
import { createClassName } from '@duely/util';
import ReactDOM from 'react-dom';

export type HiddenElementProps = {
  container?: Element;
  children: React.ReactNode;
  className?: string;
  as: ElementType;
};

export function HiddenElement({
  container,
  children,
  className,
  as: Component
}: HiddenElementProps) {
  className = createClassName(className, '!hidden');
  const element = <Component className={className}>{children}</Component>;

  return container ? ReactDOM.createPortal(element, container) : element;
}
