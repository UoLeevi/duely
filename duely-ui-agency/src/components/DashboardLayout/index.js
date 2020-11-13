import { useClassName } from '@duely/react';
import Sidebar from 'components/Sidebar';
// import TopBar from 'components/TopBar';

export default function DashboardLayout({ children }) {
  useClassName(document.documentElement, 'bg-gray-100');
  return (
    <div className="relative w-full">
      <Sidebar className="fixed inset-x-0 bottom-0" />
      <div className="pb-20 md:pb-0 md:pl-48 w-full box-border">
        <div className="flex flex-col p-4 space-y-6">
          { children }
        </div>
      </div>
    </div>
  );
}
