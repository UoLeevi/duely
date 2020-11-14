import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardCard } from '.';

export function DashboardCardGetStartedCreateServices() {
  return (
    <DashboardCard className="px-4 py-6 items-center text-center space-y-4">
      <h2 className="font-medium text-xl">Create services</h2>
      <p className="flex-1 text-sm font-medium text-gray-600">Start selling online by creating your first service.</p>
      <Link to="/dashboard/services/new-service" className="rounded-md px-6 py-2 font-medium shadow-sm bg-indigo-500 text-white">Create a service</Link>
    </DashboardCard>
  );
}
