import React, { useId, useRef } from 'react';
import { createClassName } from '@duely/util';
import { TimeConversionTooltip, Tooltip } from '../Tooltip';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';
import { useQuery, invoice_Q, agency_stripe_account_Q } from '@duely/client';
import { icons } from '../icons';
import { Link } from 'react-router-dom';

export type InvoicePropertyValueProps = {
  children: string | null | undefined;
};

export function InvoicePropertyValue({ children: invoice_id }: InvoicePropertyValueProps) {
  const tooltipId = useId();
  let { loading } = useQueryState();
  let { data: stripe_account } = useQueryState(agency_stripe_account_Q);
  const className = 'text-sm text-gray-700 dark:text-gray-300';

  const { data: invoice, loading: invoiceLoading } = useQuery(
    invoice_Q,
    { invoice_id: invoice_id!, stripe_account_id: stripe_account?.id! },
    { skip: loading || !invoice_id || !stripe_account?.id }
  );

  loading ||= invoiceLoading;

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-gray-400 animate-pulse">{icons['document-text.solid']}</div>
        <SkeletonText className="text-sm" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Link to={`/dashboard/invoices/${invoice?.id}`} className="relative text-gray-400">
          {icons['document-text.solid']}
        </Link>

        <div data-tooltip={tooltipId}>
          <Link
            to={`/dashboard/invoices/${invoice?.id}`}
            className={`relative font-medium transition-all hover:underline underline-offset-2 space-x-2 hover:text-gray-900 ${className}`}
          >
            <span>Invoice</span>
            <span>{invoice?.receipt_number}</span>
          </Link>
        </div>

        <Tooltip id={tooltipId} position="bottom center">
          <div className="grid grid-flow-row grid-cols-[auto_auto] text-xs">
            <div className="py-1 pl-2 pr-1 font-medium border-t border-black/5">ID</div>
            <div className="py-1 pl-1 pr-2 font-mono border-t border-black/5">{invoice?.id}</div>
          </div>
        </Tooltip>
      </div>
    </>
  );
}
