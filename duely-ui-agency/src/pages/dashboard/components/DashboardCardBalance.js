import React from 'react';
import { Util, Card, SkeletonText } from '@duely/react';
import { useQuery, current_agency_Q, agency_stripe_account_balance_Q } from '@duely/client';
import { BsBook } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export function DashboardCardBalance() {
  const { data: agency } = useQuery(current_agency_Q);
  const { data: balance, loading, error } = useQuery(agency_stripe_account_balance_Q, { agency_id: agency.id });

  if (loading) {
    return (
      <Card className="h-full">
        <div className="flex flex-row flex-1 rounded-md-t p-4 items-center space-x-4">
          <BsBook className="text-2xl text-gray-500" />
          <div className="flex flex-col flex-1 space-y-1">
            <div className="flex flex-row items-center space-x-4">
              <h3 className="font-semibold text-gray-600 flex-1">Balance</h3>
            </div>
            <div>
              <div className="flex flex-row items-center space-x-4">
                <SkeletonText />
              </div>
              <div className="flex flex-row items-center space-x-4">
                <SkeletonText className="text-sm" />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-md-b px-4 py-2 bg-gray-100">
          <Link to="/dashboard/payments"><span className="text-sm font-semibold text-indigo-600">View all</span></Link>
        </div>
      </Card>
    );
  }

  if (error) {
    return null;
  }

  const balancesByCurrency = {};

  for (const b of balance.available) {
    balancesByCurrency[b.currency] = {
      available: b.amount
    };
  }

  for (const b of balance.pending) {
    balancesByCurrency[b.currency] = {
      ...balancesByCurrency[b.currency],
      pending: b.amount
    };
  }

  return (
    <Card className="h-full">
      <div className="flex flex-row flex-1 rounded-md-t p-4 items-center space-x-4">
        <BsBook className="text-2xl text-gray-500" />
        <div className="flex flex-col flex-1 space-y-1">
          <div className="flex flex-row items-center space-x-4">
            <h3 className="font-semibold text-gray-600 flex-1">Balance</h3>
          </div>
          {Object.entries(balancesByCurrency).map(([currency, { available, pending }]) => (
            <div key={currency}>
              <div className="flex flex-row items-center space-x-4">
                <span className="font-medium text-gray-800 flex-1">{Util.formatCurrency(available, currency)} available</span>
              </div>
              <div className="flex flex-row items-center space-x-4">
                <span className="text-sm font-medium text-gray-400 flex-1">{Util.formatCurrency(available, currency)} pending</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-md-b px-4 py-2 bg-gray-100">
        <Link to="/dashboard/payments"><span className="text-sm font-semibold text-indigo-600">View all</span></Link>
      </div>
    </Card>
  );
}
