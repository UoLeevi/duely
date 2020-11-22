import { Util, useClassName, Sidebar } from '@duely/react';
import { useQuery, current_user_Q } from '@duely/client';
import { BsCreditCard, BsGear, BsHouseDoor } from 'react-icons/bs';
import { Link } from 'react-router-dom';
// import TopBar from 'components/TopBar';

function ProfileUserInfo({ className }) {
  className = Util.createClassName(className, 'flex flex-col items-center');
  const { data: current_user } = useQuery(current_user_Q);
  return (
    <div className={className}>
      <div className="w-16 h-16 mb-3 bg-indigo-500 ring-2 ring-indigo-500 ring-offset-4 grid self-center shadow place-items-center tracking-wider text-3xl rounded-full text-white">
        {Util.getNameInitials(current_user.name)}
      </div>
      <span className="pt-1 font-medium">{current_user.name}</span>
      <span className="text-xs truncate w-44 text-center">{current_user.email_address}</span>
      <Link to="#" className="rounded font-medium text-xs mt-4 bg-gray-50 border text-gray-600 border-gray-300 px-3 leading-6 shadow-sm">Edit</Link>
    </div>
  );
}

const sidebarLinks = [
  {
    text: "Profile",
    icon: BsHouseDoor,
    to: '/profile',
    exact: true
  },
  {
    text: "Payments",
    icon: BsCreditCard,
    to: '/profile/payments',
  },
  {
    text: "Settings",
    icon: BsGear,
    to: '/profile/settings',
  },
];

export function ProfileLayout({ children }) {
  useClassName(document.documentElement, 'bg-gray-25');

  return (
    <div className="relative w-full">
      <Sidebar className="fixed inset-x-0 bottom-0"
        links={sidebarLinks}
        topContent={<ProfileUserInfo className="pt-16 pb-6" />}
      />
      
      <div className="pb-20 md:pb-0 md:pl-48 xl:pl-64 w-full box-border">
        <div className="flex flex-col p-4 space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
