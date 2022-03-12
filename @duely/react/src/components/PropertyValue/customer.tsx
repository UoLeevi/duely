import React, { useRef } from 'react';
import { Tooltip } from '../Tooltip';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';
import { useQuery, customer_Q, agency_stripe_account_Q } from '@duely/client';
import { icons } from '../icons';
import { Link } from 'react-router-dom';

export type CustomerPropertyValueProps = {
  children: string | undefined | null;
};

export function CustomerPropertyValue({ children: customer_id }: CustomerPropertyValueProps) {
  const ref = useRef<HTMLDivElement>(null);
  let { data: stripe_account } = useQueryState(agency_stripe_account_Q);
  let { loading } = useQueryState();
  const className = 'text-sm text-gray-700 dark:text-gray-300';

  const { data: customer, loading: customerLoading } = useQuery(
    customer_Q,
    { customer_id: customer_id!, stripe_account_id: stripe_account?.id },
    { skip: loading || !customer_id }
  );

  loading ||= customerLoading;

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-gray-400 animate-pulse">{icons['user.solid']}</div>
        <SkeletonText className="text-sm" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Link to={`/dashboard/customers/${customer?.id}`} className="relative text-gray-400">
          {icons['user.solid']}
        </Link>

        <div ref={ref}>
          <Link
            to={`/dashboard/customers/${customer?.id}`}
            className={`relative font-medium transition-all hover:underline underline-offset-2 hover:text-gray-900 ${className}`}
          >
            {customer?.name ?? customer?.email_address?.split('@')[0]}
          </Link>
        </div>

        <Tooltip elementRef={ref} position="bottom center">
          <div className="grid grid-flow-row grid-cols-[auto_auto] text-xs">
            <div className="py-1 pl-2 pr-1 font-medium border-t border-black/5">Email address</div>
            <div className="py-1 pl-1 pr-2 border-t border-black/5">{customer?.email_address}</div>
            <div className="py-1 pl-2 pr-1 font-medium border-t border-black/5">ID</div>
            <div className="py-1 pl-1 pr-2 font-mono border-t border-black/5">{customer?.id}</div>
          </div>
        </Tooltip>
      </div>
    </>
  );
}
