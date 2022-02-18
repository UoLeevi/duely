import React, { useRef } from 'react';
import { createClassName } from '@duely/util';
import { TimeConversionTooltip, Tooltip } from '../Tooltip';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';
import { useQuery, customer_Q } from '@duely/client';
import { icons } from '../icons';
import { Link } from 'react-router-dom';

type Customer = { id: string; name?: string | null; email_address?: string; email?: string | null };

export type CustomerPropertyValueProps = {
  children: string | Customer | undefined | null;
};

export function CustomerPropertyValue({ children }: CustomerPropertyValueProps) {
  const ref = useRef<HTMLDivElement>(null);
  let { loading } = useQueryState();
  const className = 'text-sm text-gray-700 dark:text-gray-300';

  const skip = loading || typeof children !== 'string';
  let customer: Customer | undefined | null;
  let customerLoading: boolean;

  ({ data: customer, loading: customerLoading } = useQuery(
    customer_Q,
    { customer_id: skip ? '' : children },
    { skip }
  ));

  loading ||= customerLoading;

  if (typeof children === 'object') {
    customer = children;
  }

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
            {customer?.name ?? (customer?.email_address ?? customer?.email)?.split('@')[0]}
          </Link>
        </div>

        <Tooltip elementRef={ref} position="bottom center">
          <div className="grid grid-flow-row grid-cols-[auto_auto] text-xs">
            <div className="py-1 pl-2 pr-1 font-medium border-t border-black/5">Email address</div>
            <div className="py-1 pl-1 pr-2 border-t border-black/5">
              {customer?.email_address ?? customer?.email}
            </div>
            <div className="py-1 pl-2 pr-1 font-medium border-t border-black/5">ID</div>
            <div className="py-1 pl-1 pr-2 font-mono border-t border-black/5">{customer?.id}</div>
          </div>
        </Tooltip>
      </div>
    </>
  );
}
