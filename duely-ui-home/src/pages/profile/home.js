import { ProfileBrandTable } from './components';
import { Link } from 'react-router-dom';
import { Card } from '@duely/react';

export default function ProfileHome() {
  return (
    <div className="flex flex-col space-y-5 p-1 sm:p-8 max-w-screen-lg">
      <div className="flex justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Your brands</h2>
        <Link to="/new-brand" className="text-sm sm:text-base bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow">
          + Create a brand
          </Link>
      </div>
      <Card>
        <ProfileBrandTable />
      </Card>
    </div>
  );
}
