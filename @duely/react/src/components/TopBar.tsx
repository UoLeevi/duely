import React from 'react';
import { Util } from '../util';
import { createClassName } from '@duely/util';

type TopBarDefaults = {
  children: React.ReactNode | ((props?: Record<string, any> | undefined) => React.ReactNode);
};

const defaults: TopBarDefaults = {
  children: undefined
};

export const TopBar = Object.assign(TopBarRoot, { defaults });

type TopBarProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function TopBarRoot({ children, className, ...props }: TopBarProps) {
  className = createClassName(
    'box-border self-stretch sticky inset-x-0 top-0 z-10 h-12 px-3 bg-white border-b border-gray-300 md:h-16 md:px-4',
    className
  );

  children = Util.getReactElement(children ?? defaults.children);

  return (
    <header className={className} {...props}>
      <div className="container box-border flex items-center justify-between h-full mx-auto">
        {children}
      </div>
    </header>
  );
}
