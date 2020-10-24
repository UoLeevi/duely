import { Menu, Transition } from '@headlessui/react';
import { useRecoilValueLoadable } from 'recoil';
import { AiOutlineLoading } from 'react-icons/ai';
import { currentUserQuery } from '@/auth';
import Link from 'next/link';

export default function NavMenu() {

  const currentUserLoadable = useRecoilValueLoadable(currentUserQuery);

  if (currentUserLoadable.state === 'loading')
    return <AiOutlineLoading className="animate-spin text-xl text-indigo-500" />;

  if (currentUserLoadable.state === 'hasError')
    return <span>Error</span>;

  const currentUser = currentUserLoadable.contents;

  if (currentUser == null) {
    return (
      <div className="space-x-6 transition">
        <Link href="/log-in">
          <a className="font-semibold text-sm text-indigo-500">Log in</a>
        </Link>
        <Link href="/sign-up">
          <a className="border border-indigo-500 px-3 py-1 rounded font-semibold text-sm text-indigo-500">Sign up</a>
        </Link>
      </div>
    );
  }

  return (
    <Menu>
      {({ open }) => (
        <>
          <span className="rounded-md shadow-sm">
            <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
              <span>Options</span>
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Menu.Button>
          </span>

          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-200 rounded-md shadow-lg outline-none"
            >
              <div className="px-4 py-3">
                <p className="text-sm leading-5">Logged in as</p>
                <p className="text-sm font-medium leading-5 text-gray-900 truncate">
                  {currentUser.name}
                </p>
              </div>

              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#account-settings"
                      className={`${active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                        } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                    >
                      Account settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#support"
                      className={`${active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                        } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                    >
                      Support
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item
                  as="span"
                  disabled
                  className="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 cursor-not-allowed opacity-50"
                >
                  New feature (soon)
                    </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#license"
                      className={`${active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                        } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                    >
                      License
                    </a>
                  )}
                </Menu.Item>
              </div>

              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link href="/?log-out">
                      <a className={`${active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                        } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                      >
                        Log out
                    </a>
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
