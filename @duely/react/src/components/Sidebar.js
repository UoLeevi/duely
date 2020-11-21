import React from 'react';
import { Link } from 'react-router-dom';
import { Util } from '../util';
import { SidebarLink } from './SidebarLink';

// const links = [
//   {
//     text: "Home",
//     icon: BsHouseDoor,
//     to: '/dashboard',
//     exact: true
//   }
// ];

export function Sidebar({ className, links, logo }) {
  className = Util.createClassName(className, 'bg-white md:bg-gray-25 border-t md:border-none border-box z-10 w-full md:w-48 xl:w-64 h-16 md:h-full md:h-screen md:p-2');

  return (
    <aside className={className}>
      <div className="md:h-full w-full flex md:flex-col md:space-y-4 max-w-screen overflow-x-auto pb-2 md:pb-0">
        { logo && (
          <Link to="/" className="hidden md:flex items-center h-8 sm:h-10 md:h-12 relative space-x-2 text-gray-900 rounded p-1">
            <img className="h-full" src={logo} alt='logo' />
          </Link>
        )}
        <nav className="flex flex-row md:flex-col flex-1 justify-center md:justify-start space-x-1 md:space-y-2 md:space-x-0 p-1">
          {links.map(link => (
            <SidebarLink key={link.to} { ...link } />
          ))}
        </nav>
      </div>
    </aside>
  );
}
