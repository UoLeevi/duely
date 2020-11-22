import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useBreakpoints } from '../hooks';
import { Util } from '../util';

function SidebarLink({ text, icon, to, exact, className }) {
  const match = useRouteMatch({ path: to, exact });
  const Icon = icon;
  className = Util.createClassName(className,
    match ? 'text-accent md:bg-white md:shadow-sm' : 'focus-visible:text-gray-700 hover:text-gray-700 text-gray-500 border-transparent',
    'flex flex-col md:flex-row items-center focus:outline-none md:border space-y-1 md:space-y-0 md:space-x-3 rounded-md text-xs shadow-gray-500 md:text-sm font-semibold px-2 md:px-3 py-2 focus-visible:bg-white');
  return (
    <Link to={to} className={className}>
      <Icon className="text-lg sm:text-xl md:text-2xl" />
      <span>{text}</span>
    </Link>
  );
}

// const links = [
//   {
//     text: "Home",
//     icon: BsHouseDoor,
//     to: '/dashboard',
//     exact: true
//   }
// ];

export function Sidebar({ className, links, topContent, bottomContent }) {
  const { md } = useBreakpoints();
  className = Util.createClassName(className, 'bg-white md:bg-gray-25 border-t md:border-none border-box z-10 w-full md:w-48 xl:w-64 h-16 md:h-full md:h-screen md:p-2');

  return (
    <aside className={className}>
      <div className="md:h-full w-full flex md:flex-col md:justify-between md:space-y-4 max-w-screen overflow-x-auto pb-2 md:pb-0">
        { md && topContent }
        <nav className="flex flex-row md:flex-col flex-1 justify-center md:justify-start space-x-1 md:space-y-2 md:space-x-0 p-1">
          {links.map(link => (
            <SidebarLink key={link.to} { ...link } />
          ))}
        </nav>
        { md && bottomContent }
      </div>
    </aside>
  );
}
