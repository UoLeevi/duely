import React from 'react';
import { DashboardCard } from '.';

export function DashboardCardGetStartedEnablePayouts() {
  return (
    <DashboardCard className="h-full px-10 py-6 items-center text-center space-y-4">
      <h2 className="font-medium text-xl">Enable payouts</h2>
      <p className="flex-1 text-sm font-medium text-gray-600">To receive payouts, set up your payment details at Stripe.</p>
      <button className="rounded-md px-6 py-2 font-medium shadow-sm bg-indigo-500 text-white">Set up payments</button>
    </DashboardCard>
  );
}
