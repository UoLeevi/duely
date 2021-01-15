import { ProfileBrandTable } from './components';
import { Link } from 'react-router-dom';
import { Card } from '@duely/react';

export default function ProfileHome() {
  return (
    <div className="flex flex-col max-w-screen-lg p-1 space-y-5 sm:p-8">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Your brands</h2>
        <Link
          to="/new-brand"
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md shadow sm:text-base hover:bg-green-700"
        >
          + Create a brand
        </Link>
      </div>
      <Card>
        <ProfileBrandTable />
      </Card>
    </div>
  );
}
