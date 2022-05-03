import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { useQuery, current_user_Q } from '@duely/client';
import { DropMenu, LoadingSpinner } from '@duely/react';

export default function NavMenu() {
  const currentUserQ = useQuery(current_user_Q);

  if (currentUserQ.loading) {
    return <LoadingSpinner />;
  }

  const currentUser = currentUserQ.data;

  if (!currentUser) {
    return (
      <div className="space-x-6 transition">
        <Link
          to={{ pathname: '/about', state: { redirectTo: '/about' } }}
          className="text-sm font-semibold text-gray-700 hover:text-gray-900"
        >
          About
        </Link>
        <Link
          to={{ pathname: '/log-in', state: { redirectTo: '/profile' } }}
          className="text-sm font-semibold text-indigo-500"
        >
          Log in
        </Link>
        <Link
          to="/sign-up"
          className="px-3 py-1 text-sm font-semibold text-indigo-500 border border-indigo-300 rounded shadow-sm"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-6 transition">
      <Link
        to={{ pathname: '/about', state: { redirectTo: '/about' } }}
        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
      >
        About
      </Link>

      <DropMenu>
        <DropMenu.Button>
          <div className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring-blue active:bg-gray-50 active:text-gray-800">
            <span>Options</span>
            <svg className="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </DropMenu.Button>

        <div className="px-4 py-3 border-b">
          <p className="text-sm leading-5">Logged in as</p>
          <p className="text-sm font-medium leading-5 text-gray-900 truncate">{currentUser.name}</p>
        </div>

        <DropMenu.Item to="/profile" icon="user.solid">
          Profile
        </DropMenu.Item>
        <DropMenu.Item to="/?log-out" icon="logout.solid">
          Log Out
        </DropMenu.Item>
      </DropMenu>
    </div>
  );
}
