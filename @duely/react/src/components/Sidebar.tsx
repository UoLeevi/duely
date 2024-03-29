import React, { useState } from 'react';
import { Link, useLocation, useRouteMatch, matchPath } from 'react-router-dom';
import { useBreakpoints } from '../hooks';
import { createClassName, hasProperty } from '@duely/util';

export type SidebarProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  links: (
    | {
        text: string;
        icon: React.ComponentType<{ className: string }>;
        exact?: boolean;
        to: string;
      }
    | {
        text: string;
        icon: React.ComponentType<{ className: string }>;
        name: string;
        items: {
          text: string;
          exact?: boolean;
          to: string;
        }[];
      }
  )[];
};

export function Sidebar({ className, links, topContent, bottomContent, ...props }: SidebarProps) {
  const { md } = useBreakpoints();
  const location = useLocation();
  const [toggledLinkWithItems, setToggledLinkWithItems] = useState(() =>
    (links.filter((link) => hasProperty(link, 'items')) as SidebarLinkWithItemsProps[]).find(
      (link) => {
        const hash = `#nav-${encodeURIComponent(link.name)}`;
        return (
          location.hash === hash ||
          link.items.some((item) =>
            matchPath(location.pathname, { path: item.to, exact: item.exact })
          )
        );
      }
    )
  );

  className = createClassName(
    className,
    'z-20 w-full h-16 bg-white dark:bg-gray-800 border-t dark:border-gray-700 dark:md:bg-gray-900 md:border-none border-box md:w-48 xl:w-64 md:h-full md:p-2'
  );

  return (
    <aside className={className} {...props}>
      <div className="flex w-full pb-2 overflow-x-auto md:h-full md:flex-col md:justify-between md:space-y-4 max-w-screen md:pb-0">
        {md && topContent}
        <nav className="flex flex-row justify-center flex-1 p-1 space-x-1 md:flex-col md:justify-start md:space-y-1.5 md:space-x-0">
          {md &&
            links.map((link) =>
              hasProperty(link, 'items') ? (
                <SidebarLinkWithItems
                  key={link.name}
                  {...link}
                  isToggled={link === toggledLinkWithItems}
                  toggle={() =>
                    setToggledLinkWithItems(
                      link === toggledLinkWithItems
                        ? undefined
                        : (link as SidebarLinkWithItemsProps)
                    )
                  }
                />
              ) : (
                <SidebarLink key={link.to} {...link} />
              )
            )}

          {!md &&
            (toggledLinkWithItems ? (
              <>
                <SidebarLinkWithItems
                  key={toggledLinkWithItems.name}
                  {...toggledLinkWithItems}
                  isToggled={true}
                  toggle={() => setToggledLinkWithItems(undefined)}
                  className="mr-3"
                />
                <div className="flex flex-row self-center justify-center pl-3 pr-1 space-x-1 border-l-2">
                  {toggledLinkWithItems.items.map((item) => (
                    <SidebarLinkItem key={item.to} {...item} />
                  ))}
                </div>
              </>
            ) : (
              links.map((link) =>
                hasProperty(link, 'items') ? (
                  <SidebarLinkWithItems
                    key={link.name}
                    {...link}
                    isToggled={link === toggledLinkWithItems}
                    toggle={() =>
                      setToggledLinkWithItems(
                        link === toggledLinkWithItems
                          ? undefined
                          : (link as SidebarLinkWithItemsProps)
                      )
                    }
                  />
                ) : (
                  <SidebarLink key={link.to} {...link} />
                )
              )
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
  className = createClassName(
    className,
    match ? 'text-indigo-600' : 'focus-visible:text-gray-800 hover:text-gray-800 text-gray-600',
    'flex flex-col md:flex-row items-center focus:outline-none space-y-1 md:space-y-0 md:space-x-3 text-xs md:text-sm font-semibold px-2 md:px-3 py-2 focus-visible:bg-white dark:focus-visible:bg-gray-800'
  );
  return (
    <Link to={to} className={className}>
      <Icon className="text-lg sm:text-xl md:text-2xl h-[1.05em] w-[1.05em]" />
      <span>{text}</span>
    </Link>
  );
}

type SidebarLinkWithItemsProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  text: string;
  name: string;
  to?: string;
  isToggled: boolean;
  toggle: () => void;
  icon: React.ComponentType<{ className: string }>;
  items: {
    text: string;
    exact?: boolean;
    to: string;
  }[];
};

function SidebarLinkWithItems({
  text,
  name,
  to,
  icon,
  items,
  className,
  isToggled,
  toggle
}: SidebarLinkWithItemsProps) {
  const match = useRouteMatch({ path: to, exact: true });
  const hash = `#nav-${encodeURIComponent(name)}`;
  const { md } = useBreakpoints();

  const Icon = icon;
  className = createClassName(
    className,
    match
      ? 'text-indigo-600'
      : isToggled
      ? 'text-gray-800 md:text-gray-600'
      : 'focus-visible:text-gray-800 hover:text-gray-800 text-gray-600',
    'flex flex-col md:flex-1 group md:flex-row items-center focus:outline-none md:border-transparent space-y-1 md:space-y-0 md:space-x-3 rounded-md text-xs shadow-gray-500 md:text-sm font-semibold px-2 md:px-3 py-2 focus-visible:bg-white dark:focus-visible:bg-gray-800'
  );

  return (
    <div className="flex flex-col">
      <Link className={className} to={{ pathname: to, hash }} onClick={toggle}>
        <Icon className="text-lg sm:text-xl md:text-2xl h-[1.05em] w-[1.05em]" />
        <span>{text}</span>

        {md && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`self-end w-5 h-5 ml-1 transition-opacity duration-100 pointer-events-none group-focus:opacity-1 group-hover:opacity-1 ${
              isToggled ? 'opacity-1' : 'opacity-0'
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </Link>

      {isToggled && md && (
        <nav className="flex mt-1 flex-col ml-3 space-y-1.5 border-l border-indigo-600/25">
          {items.map((item) => (
            <SidebarLinkItem key={item.to} {...item} />
          ))}
        </nav>
      )}
    </div>
  );
}

type SidebarLinkItemProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  text: string;
  exact?: boolean;
  to: string;
};

function SidebarLinkItem({ text, to, exact, className }: SidebarLinkItemProps) {
  const match = useRouteMatch({ path: to, exact });
  className = createClassName(
    className,
    match ? 'text-indigo-600 border-indigo-600' : 'focus-visible:text-gray-800 hover:text-gray-800 text-gray-600 border-transparent',
    'flex flex-col justify-center md:border-l-2 md:justify-start md:flex-row items-center focus:outline-none space-y-1 md:space-y-0 md:space-x-3 text-xs md:text-sm font-semibold px-2 md:px-4 py-0.5 md:-ml-px md:-mt-px'
  );
  return (
    <Link to={to} className={className}>
      <span>{text}</span>
    </Link>
  );
}
