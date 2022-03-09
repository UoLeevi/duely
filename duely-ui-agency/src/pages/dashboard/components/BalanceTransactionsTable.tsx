import React from 'react';
import { Currency, ElementType, formatCurrency, formatDate, sentenceCase } from '@duely/util';
import {
  Util,
  Table,
  SkeletonText,
  ColoredChip,
  useCursorPagination,
  PropertyValue
} from '@duely/react';
import {
  useQuery,
  agency_stripe_account_balance_transactions_Q,
  current_agency_Q
} from '@duely/client';

export function BalanceTransactionsTable() {
  const { data: agency } = useQuery(current_agency_Q);
  const {
    data: balance_transactions,
    loading,
    error
  } = useQuery(agency_stripe_account_balance_transactions_Q, { agency_id: agency!.id });

  type TBalanceTransaction = any;

  const pagination = useCursorPagination<TBalanceTransaction, 'id'>({
    getItems: ({ limit, starting_after }) => {
      const { data, loading, error } = useQuery(
        agency_stripe_account_balance_transactions_Q,
        {
          agency_id: agency?.id!,
          limit,
          starting_after: starting_after
        },
        { skip: !agency }
      );

      return { items: data ?? [], loading, error };
    },
    itemsPerPage: 5,
    keyField: 'id'
  });

  return (
    <Table pagination={pagination} dense={true} wrap={{ sm: 3 }} loading={loading} error={error}>
      <Table.Column header="Type">
        {(txn: TBalanceTransaction | null) =>
          !txn ? (
            <div className="flex flex-col space-y-2">
              <SkeletonText className="text-sm" />
              <SkeletonText className="text-xs" />
            </div>
          ) : txn.type === 'charge' ? (
            <PropertyValue.Charge>{txn.source}</PropertyValue.Charge>
          ) : txn.type === 'payout' ? (
            <PropertyValue.Payout>{txn.source}</PropertyValue.Payout>
          ) : (
            <div className="flex flex-col">
              <div className="text-sm font-semibold">{sentenceCase(txn.reporting_category)}</div>
              {txn.reporting_category !== txn.type && (
                <div className="text-xs text-gray-500">{sentenceCase(txn.type)}</div>
              )}
            </div>
          )
        }
      </Table.Column>

      <Table.Column header="Date">
        {(txn: TBalanceTransaction | null) =>
          !txn ? (
            <div className="flex flex-col space-y-2">
              <SkeletonText className="text-xs" />
              <SkeletonText className="text-xs" />
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <PropertyValue.Date>{txn.created}</PropertyValue.Date>
              {txn.status === 'pending' && txn.available_on !== txn.created && (
                <div className="text-xs text-gray-500">
                  available on {formatDate(new Date(txn.available_on))}
                </div>
              )}
            </div>
          )
        }
      </Table.Column>

      <Table.Column header="Amount">
        {(txn: TBalanceTransaction | null) =>
          !txn ? (
            <div className="flex flex-col space-y-2">
              <SkeletonText className="text-sm" />
              <SkeletonText className="text-xs" />
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="text-sm">{formatCurrency(txn.amount, txn.currency as Currency)}</div>
              {txn.net !== txn.amount && (
                <div className="text-xs text-gray-500">
                  net {formatCurrency(txn.net, txn.currency as Currency)}
                </div>
              )}
            </div>
          )
        }
      </Table.Column>

      <Table.Column header="Description" span={{ md: 2 }}>
        {(txn: TBalanceTransaction | null) =>
          !txn ? (
            <div className="flex flex-col space-y-2">
              <SkeletonText className="text-sm" />
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="text-sm">{txn.description}</div>
            </div>
          )
        }
      </Table.Column>

      <Table.Column header="Status" shrink>
        {(txn: TBalanceTransaction | null) =>
          !txn ? (
            <div className="flex flex-col items-center">
              <ColoredChip color="gray" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ColoredChip text={txn.status} color={{ pending: 'orange', available: 'green' }} />
            </div>
          )
        }
      </Table.Column>
    </Table>
  );
}
