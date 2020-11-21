import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Util } from '../util';

export function SidebarLink({ text, icon, to, exact, className }) {
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
