import React from 'react';
import { formatPrice } from '@duely/util';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';
// import { useQuery, price_Q } from '@duely/client';

type Price = {
  id: string;
  unit_amount?: number | null;
  currency: string;
  recurring?: {
    interval_count: number;
    interval: string;
  } | null;
  recurring_interval?: string | null;
  recurring_interval_count?: number | null;
};

export type PricePropertyValueProps = {
  children: string | Price | undefined | null;
};

export function PricePropertyValue({ children }: PricePropertyValueProps) {
  // const ref = useRef<HTMLElement>(null);
  let { loading } = useQueryState();
  const className = 'text-sm text-gray-700 dark:text-gray-300';

  const skip = loading || typeof children !== 'string';
  let price: Price | undefined | null;
  let priceLoading: boolean;

  // ({ data: price, loading: priceLoading } = useQuery(
  //   price_Q,
  //   { price_id: skip ? '' : children },
  //   { skip }
  // ));

  // loading || priceLoading;

  if (typeof children === 'object') {
    price = children;
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <SkeletonText className={className} />
        </div>
      </div>
    );
  }

  // TODO: Remove this check
  if (price === null || typeof price !== 'object') return null;

  return (
    <>
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <span className={className}>{formatPrice(price)}</span>
        </div>
      </div>
    </>
  );
}
