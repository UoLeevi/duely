import React from 'react';
import { Util, Table } from '@duely/react';
import { useQuery, agency_stripe_account_balance_transactions_Q, current_agency_Q } from '@duely/client';

export function BalanceTransactionsTable() {
  const { data: agency } = useQuery(current_agency_Q);
  const { data: balance_transactions, loading, error } = useQuery(agency_stripe_account_balance_transactions_Q, { agency_id: agency.id });

  const headers = [
    'Type',
    'Date',
    'Description',
    'Amount',
    'Status',
  ];

  const columns = [
    // type
    tx => (
      <div className="flex flex-col">
        <div className="text-sm font-semibold">{tx.reporting_category}</div>
        {tx.reporting_category !== tx.type && (
          <div className="text-xs text-gray-500">{tx.type}</div>
        )}
      </div>
    ),

    // date
    tx => (
      <div className="flex flex-col">
        <div className="text-sm">{Util.formatDate(new Date(tx.created))}</div>
        {tx.status === 'pending' && tx.available_on !== tx.created && (
          <div className="text-xs text-gray-500">available on {Util.formatDate(new Date(tx.available_on))}</div>
        )}
      </div>
    ),

    // description
    tx => (
      <div className="flex flex-col">
        <div className="text-sm">{tx.description}</div>
      </div>
    ),

    // amount
    tx => (
      <div className="flex flex-col">
        <div className="text-sm">{Util.formatCurrency(tx.amount / 100, tx.currency)}</div>
        <div className="text-xs text-gray-500">net {Util.formatCurrency(tx.net / 100, tx.currency)}</div>
      </div>
    ),

    // status
    tx => (
      <div className="flex flex-col">
        <div className="text-sm">{tx.status}</div>
      </div>
    ),
  ];

  return (
    <Table className="px-6 py-4" rows={balance_transactions} columns={columns} headers={headers} dense={true} loading={loading} error={error} />
  );
}
