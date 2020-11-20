import { BrandList } from './components';
import TopBar from 'components/TopBar';
import { Link } from 'react-router-dom';

import { useQuery, current_user_Q } from '@duely/client';
import { Util } from '@duely/react';

function getNameInitials(name) {
  const initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

function ProfileUserInfo({ className }) {
  className = Util.createClassName(className, 'flex flex-col space-y-2 w-64');
  const { data: current_user } = useQuery(current_user_Q);
  return (
    <div className={className}>
      <div className="w-32 h-32 bg-indigo-500 grid self-center shadow place-items-center tracking-wider text-5xl rounded-full text-white">
        {getNameInitials(current_user.name)}
      </div>
      <div className="flex justify-between space-x-3 pt-5">
        <span className="text-xl">{current_user.name}</span>
        <Link to="#" className="rounded font-medium text-xs bg-gray-200 border px-3 py-1 shadow-sm">Edit profile</Link>
      </div>
      <span className="text-xs">{current_user.email_address}</span>
    </div>
  );
}

export default function ProfileHome() {
  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-wrap flex-1 justify-around pt-16 pb-8 px-2 sm:px-4 -m-8">
          <div className="self-center p-8">
            <ProfileUserInfo />
          </div>
          <div className="flex flex-col space-y-5 self-center p-8">
            <div className="flex justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Your brands</h2>
              <Link to="/new-brand" className="text-sm sm:text-base bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow">
                + Create a brand
              </Link>
            </div>
            <BrandList />
          </div>
        </main>
      </div>
    </div>
  );
}
