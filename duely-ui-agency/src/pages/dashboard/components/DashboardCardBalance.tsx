import React from 'react';
import { Card, SkeletonText } from '@duely/react';
import { useQuery, current_agency_Q, agency_stripe_account_balance_Q } from '@duely/client';
import { Link } from 'react-router-dom';
import { Currency, formatCurrency } from '@duely/util';

export function DashboardCardBalance() {
  const { data: agency } = useQuery(current_agency_Q);
  const {
    data: balance,
    loading,
    error
  } = useQuery(agency_stripe_account_balance_Q, { agency_id: agency?.id! }, { skip: !agency });

  if (error || !balance) {
    return null;
  }

  const balancesByCurrency: Record<
    string,
    {
      available?: number;
      pending?: number;
    }
  > = {};

  if (!loading) {
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
  }

  return (
    <Card className="h-full">
      <div className="flex flex-row items-center flex-1 p-4 space-x-4 rounded-md-t">
        <svg
          className="text-gray-500 w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
        <div className="flex flex-col flex-1 space-y-1">
          <div className="flex flex-row items-center space-x-4">
            <h3 className="flex-1 font-semibold text-gray-600">Balance</h3>
          </div>

          {loading && (
            <div>
              <div className="flex flex-row items-center space-x-4">
                <SkeletonText />
              </div>
              <div className="flex flex-row items-center space-x-4">
                <SkeletonText className="text-sm" />
              </div>
            </div>
          )}

          {Object.entries(balancesByCurrency).map(([currency, { available, pending }]) => (
            <div key={currency}>
              <div className="flex flex-row items-center space-x-4">
                <span className="flex-1 font-medium text-gray-800 dark:text-gray-300">
                  {formatCurrency(available ?? 0, currency as Currency)} available
                </span>
              </div>
              <div className="flex flex-row items-center space-x-4">
                <span className="flex-1 text-sm font-medium text-gray-400">
                  {formatCurrency(pending ?? 0, currency as Currency)} pending
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-b-md">
        <Link to="/dashboard/payments">
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            View all
          </span>
        </Link>
      </div>
    </Card>
  );
}
