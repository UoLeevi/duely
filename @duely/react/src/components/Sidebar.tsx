import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useBreakpoints } from '../hooks';
import { Util } from '../util';

type SidebarProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  links: {
    text: string;
    icon: React.ComponentType<{ className: string }>;
    exact?: boolean;
    to: string;
  }[];
};

export function Sidebar({ className, links, topContent, bottomContent, ...props }: SidebarProps) {
  const { md } = useBreakpoints();
  className = Util.createClassName(
    className,
    'z-10 w-full h-16 bg-white dark:bg-gray-800 border-t dark:border-gray-700 md:bg-gray-25 dark:md:bg-gray-900 md:border-none border-box md:w-48 xl:w-64 md:h-full md:p-2'
  );

  return (
    <aside className={className} {...props}>
      <div className="flex w-full pb-2 overflow-x-auto md:h-full md:flex-col md:justify-between md:space-y-4 max-w-screen md:pb-0">
        {md && topContent}
        <nav className="flex flex-row justify-center flex-1 p-1 space-x-1 md:flex-col md:justify-start md:space-y-2 md:space-x-0">
          {links.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>
        {md && bottomContent}
      </div>
    </aside>
  );
}

type SidebarLinkProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  text: string;
  icon: React.ComponentType<{ className: string }>;
  exact?: boolean;
  to: string;
};

function SidebarLink({ text, icon, to, exact, className }: SidebarLinkProps) {
  const match = useRouteMatch({ path: to, exact });
  const Icon = icon;
  className = Util.createClassName(
    className,
    match
      ? 'md:bg-white dark:md:bg-gray-800 md:shadow-sm dark:border-gray-700'
      : 'focus-visible:text-gray-700 hover:text-gray-700 border-transparent',
    'flex flex-col md:flex-row items-center focus:outline-none md:border space-y-1 md:space-y-0 md:space-x-3 rounded-md text-gray-500 text-xs shadow-gray-500 md:text-sm font-semibold px-2 md:px-3 py-2 focus-visible:bg-white dark:focus-visible:bg-gray-800'
  );
  return (
    <Link to={to} className={className}>
      <Icon className="text-lg sm:text-xl md:text-2xl h-[1.05em] w-[1.05em]" />
      <span>{text}</span>
    </Link>
  );
}
