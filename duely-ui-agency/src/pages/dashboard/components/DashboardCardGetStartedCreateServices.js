import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@duely/react';

export function DashboardCardGetStartedCreateServices() {
  return (
    <Card className="items-center px-10 py-6 space-y-4 text-center">
      <h2 className="text-xl font-medium underline-highlight-accent">Create services</h2>
      <p className="flex-1 text-sm font-medium text-gray-600">Start selling online by creating your first service.</p>
      <Link to="/dashboard/services/new-service" className="px-6 py-2 font-medium text-white bg-indigo-500 rounded-md shadow-sm">Create a service</Link>
    </Card>
  );
}
