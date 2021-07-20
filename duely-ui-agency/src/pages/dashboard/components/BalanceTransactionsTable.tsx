import React from 'react';
import { Currency } from '@duely/core';
import { Util, Table, SkeletonText } from '@duely/react';
import {
  useQuery,
  agency_stripe_account_balance_transactions_Q,
  current_agency_Q
} from '@duely/client';
import { ColoredChip } from './ColoredChip';

export function BalanceTransactionsTable() {
  const { data: agency } = useQuery(current_agency_Q);
  const {
    data: balance_transactions,
    loading,
    error
  } = useQuery(agency_stripe_account_balance_transactions_Q, { agency_id: agency!.id });

  const headers = ['Type', 'Date', 'Description', 'Amount', 'Status'];

  type TBalanceTransaction = NonNullable<typeof balance_transactions> extends readonly (infer T)[]
    ? T
    : never;

  const columns = [
    // type
    (txn: TBalanceTransaction | null) =>
      !txn ? (
        <div className="flex flex-col space-y-2">
          <SkeletonText className="text-sm" />
          <SkeletonText className="text-xs" />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="text-sm font-semibold">{Util.sentenceCase(txn.reporting_category)}</div>
          {txn.reporting_category !== txn.type && (
            <div className="text-xs text-gray-500">{Util.sentenceCase(txn.type)}</div>
          )}
        </div>
      ),

    // date
    (txn: TBalanceTransaction | null) =>
      !txn ? (
        <div className="flex flex-col space-y-2">
          <SkeletonText className="text-xs" />
          <SkeletonText className="text-xs" />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="text-xs">{Util.formatDate(new Date(txn.created))}</div>
          {txn.status === 'pending' && txn.available_on !== txn.created && (
            <div className="text-xs text-gray-500">
              available on {Util.formatDate(new Date(txn.available_on))}
            </div>
          )}
        </div>
      ),

    // description
    (txn: TBalanceTransaction | null) =>
      !txn ? (
        <div className="flex flex-col space-y-2">
          <SkeletonText className="text-sm" />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="text-sm">{txn.description}</div>
        </div>
      ),

    // amount
    (txn: TBalanceTransaction | null) =>
      !txn ? (
        <div className="flex flex-col space-y-2">
          <SkeletonText className="text-sm" />
          <SkeletonText className="text-xs" />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="text-sm">{Currency.format(txn.amount, txn.currency as Currency)}</div>
          <div className="text-xs text-gray-500">
            net {Currency.format(txn.net, txn.currency as Currency)}
          </div>
        </div>
      ),

    // status
    (txn: TBalanceTransaction | null) =>
      !txn ? (
        <div className="flex flex-col items-center">
          <ColoredChip color="gray" />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ColoredChip text={txn.status} color={{ pending: 'gray', available: 'green' }} />
        </div>
      )
  ];

  return (
    <Table
      items={balance_transactions}
      columns={columns}
      headers={headers}
      dense={true}
      loading={loading}
      error={error}
    />
  );
}
