import { Util, useClassName, Sidebar } from '@duely/react';
import { useQuery, current_user_Q } from '@duely/client';
import { BsCreditCard, BsGear, BsHouseDoor } from 'react-icons/bs';
import { Link } from 'react-router-dom';
// import TopBar from 'components/TopBar';

type ProfileUserInfoProps = {
  className?: string;
};

function ProfileUserInfo({ className }: ProfileUserInfoProps) {
  className = Util.createClassName(className, 'flex flex-col items-center');
  const { data: current_user } = useQuery(current_user_Q);
  return (
    <div className={className}>
      <div className="grid self-center w-16 h-16 mb-3 text-3xl tracking-wider text-white bg-indigo-500 rounded-full shadow ring-2 ring-indigo-500 ring-offset-4 place-items-center">
        {Util.getNameInitials(current_user!.name)}
      </div>
      <span className="pt-1 font-medium">{current_user!.name}</span>
      <span className="text-xs text-center truncate w-44">{current_user!.email_address}</span>
      <Link to="#" className="px-3 mt-4 text-xs font-medium leading-6 text-gray-600 border border-gray-300 rounded shadow-sm bg-gray-50">Edit</Link>
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

type ProfileLayoutProps = {
  children?: React.ReactNode;
};

export function ProfileLayout({ children }: ProfileLayoutProps) {
  useClassName(document.documentElement, 'bg-gray-25');

  return (
    <div className="relative w-full">
      <Sidebar className="fixed inset-x-0 bottom-0"
        links={sidebarLinks}
        topContent={<ProfileUserInfo className="pt-16 pb-6" />}
      />
      
      <div className="box-border w-full pb-20 md:pb-0 md:pl-48 xl:pl-64">
        <div className="flex flex-col p-4 space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
