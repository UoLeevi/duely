import React from 'react';
import { Util } from '../util';
import { createClassName } from '@duely/util';

type TopBar2Defaults = {
  children: React.ReactNode;
};

const defaults: TopBar2Defaults = {
  children: undefined
};

export const TopBar2 = Object.assign(TopBar2Root, { defaults });

type TopBar2Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function TopBar2Root({ children, className, ...props }: TopBar2Props) {
  className = createClassName(
    'box-border self-stretch sticky inset-x-0 z-[25] h-12 px-3 bg-gray-25 border-b border-gray-300 md:px-4',
    className
  );

  children = Util.getReactElement(children ?? defaults.children);

  return (
    <header className={className} {...props}>
      <div className="box-border flex items-center justify-between h-full mx-auto">
        {children}
      </div>
    </header>
  );
}
