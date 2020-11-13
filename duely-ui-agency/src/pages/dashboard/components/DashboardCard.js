import { Util } from '@duely/react';

// import TopBar from 'components/TopBar';
export function DashboardCard({ className, children }) {
  className = Util.createClassName(className, 'flex flex-col w-full bg-white border border-gray-300 shadow-sm rounded-md');
  return (
    <div className={className}>
      {children}
    </div>
  );
}
