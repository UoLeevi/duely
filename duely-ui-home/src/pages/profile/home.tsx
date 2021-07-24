import { ProfileBrandTable } from './components';
import { Card, LinkButton } from '@duely/react';

export default function ProfileHome() {
  return (
    <div className="flex flex-col max-w-screen-lg p-1 space-y-5 sm:p-8">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Your brands</h2>
        <LinkButton to="/new-brand" icon="plus.solid" color="indigo">
          Create a brand
        </LinkButton>
      </div>
      <Card>
        <ProfileBrandTable />
      </Card>
    </div>
  );
}
