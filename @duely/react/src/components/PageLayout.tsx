import React from 'react';
import { createClassName } from '@duely/util';
import { TopBar } from './TopBar';
import { Util } from '../util';

type PageLayoutDefaults = {
};

const defaults: PageLayoutDefaults = {
};

export const PageLayout = Object.assign(PageLayoutRoot, { defaults });

type PageLayoutProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  topBarContent?: React.ReactNode;
};

function PageLayoutRoot({ children, className, topBarContent, ...props }: PageLayoutProps) {
  className = createClassName(
    'container box-border flex flex-col justify-around flex-1 py-6',
    className
  );

  topBarContent = Util.getReactElement(topBarContent ?? TopBar.defaults.children);

  return (
    <div className="box-border relative flex flex-col items-center flex-1">
      {topBarContent && (
        <TopBar>
          {topBarContent}
        </TopBar>
      )}

      <main className={className} {...props}>
        {children}
      </main>
    </div>
  );
}
