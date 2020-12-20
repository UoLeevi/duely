import React from 'react';
import { Card } from '@duely/react';

export function DashboardCardGetStartedEnablePayouts() {
  return (
    <Card className="items-center h-full px-10 py-6 space-y-4 text-center">
      <h2 className="text-xl font-medium">Enable payouts</h2>
      <p className="flex-1 text-sm font-medium text-gray-600">To receive payouts, set up your payment details at Stripe.</p>
      <button className="px-6 py-2 font-medium text-white bg-indigo-500 rounded-md shadow-sm">Set up payments</button>
    </Card>
  );
}
