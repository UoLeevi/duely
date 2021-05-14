import { Util, useClassName, Sidebar } from '@duely/react';
import { useQuery, current_user_Q } from '@duely/client';
import { Link } from 'react-router-dom';
// import TopBar from '~/components/TopBar';

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
    icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    to: '/profile',
    exact: true
  },
  {
    text: "Payments",
    icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[1.05em] w-[1.05em]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    to: '/profile/payments',
  },
  {
    text: "Settings",
    icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[1.05em] w-[1.05em]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
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
