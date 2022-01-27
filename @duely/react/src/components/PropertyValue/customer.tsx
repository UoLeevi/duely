import React, { useRef } from 'react';
import { createClassName } from '@duely/util';
import { TimeConversionTooltip, Tooltip } from '../Tooltip';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';
import { useQuery, customer_Q } from '@duely/client';
import { icons } from '../icons';
import { Link } from 'react-router-dom';

type Customer = { id: string; name?: string | null; email_address: string };

export type CustomerPropertyValueProps = {
  children: string | Customer | undefined;
  format?: string;
};

export function CustomerPropertyValue({ children, format }: CustomerPropertyValueProps) {
  // const ref = useRef<HTMLElement>(null);
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

  loading || customerLoading;

  if (typeof children === 'object') {
    customer = children;
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-gray-400 animate-pulse">{icons['user.solid']}</div>
        <div className="flex flex-col space-y-0.5">
          <SkeletonText className="text-sm" />
          <SkeletonText className="text-xs" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Link to={`/dashboard/customers/${customer?.id}`} className="text-gray-400">
          {icons['user.solid']}
        </Link>

        <div className="flex flex-col space-y-0.5">
          <Link
            to={`/dashboard/customers/${customer?.id}`}
            className="text-sm font-medium text-gray-700 transition-all hover:underline underline-offset-2 hover:text-gray-900 dark:text-gray-300"
          >
            {customer?.name ?? customer?.email_address.split('@')[0]}
          </Link>
          <span className="text-xs text-gray-700 dark:text-gray-300">
            {customer?.email_address}
          </span>
        </div>
      </div>
    </>
  );
}
