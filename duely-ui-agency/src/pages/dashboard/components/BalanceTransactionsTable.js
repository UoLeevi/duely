import React from 'react';
import { Currency } from '@duely/core';
import { Util, Table } from '@duely/react';
import { useQuery, agency_stripe_account_balance_transactions_Q, current_agency_Q } from '@duely/client';

console.log(Currency);

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
    txn => (
      <div className="flex flex-col">
        <div className="text-sm font-semibold">{txn.reporting_category}</div>
        {txn.reporting_category !== txn.type && (
          <div className="text-xs text-gray-500">{txn.type}</div>
        )}
      </div>
    ),

    // date
    txn => (
      <div className="flex flex-col">
        <div className="text-sm">{Util.formatDate(new Date(txn.created))}</div>
        {txn.status === 'pending' && txn.available_on !== txn.created && (
          <div className="text-xs text-gray-500">available on {Util.formatDate(new Date(txn.available_on))}</div>
        )}
      </div>
    ),

    // description
    txn => (
      <div className="flex flex-col">
        <div className="text-sm">{txn.description}</div>
      </div>
    ),

    // amount
    txn => (
      <div className="flex flex-col">
        <div className="text-sm">{Currency.format(txn.amount, txn.currency)}</div>
        <div className="text-xs text-gray-500">net {Currency.format(txn.net, txn.currency)}</div>
      </div>
    ),

    // status
    txn => (
      <div className="flex flex-col">
        <div className="text-sm">{txn.status}</div>
      </div>
    ),
  ];

  return (
    <Table className="px-6 py-4" rows={balance_transactions} columns={columns} headers={headers} dense={true} loading={loading} error={error} />
  );
}
