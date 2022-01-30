import React, { useRef } from 'react';
import { createClassName } from '@duely/util';
import { TimeConversionTooltip, Tooltip } from '../Tooltip';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';
import { useQuery, product_Q } from '@duely/client';
import { icons } from '../icons';
import { Link } from 'react-router-dom';

type Product = {
  id: string;
  name?: string | null;
};

export type ProductPropertyValueProps = {
  children: string | Product | undefined | null;
};

export function ProductPropertyValue({ children }: ProductPropertyValueProps) {
  // const ref = useRef<HTMLElement>(null);
  let { loading } = useQueryState();
  const className = 'text-sm text-gray-700 dark:text-gray-300';

  const skip = loading || typeof children !== 'string';
  let product: Product | undefined | null;
  let productLoading: boolean;

  ({ data: product, loading: productLoading } = useQuery(
    product_Q,
    { product_id: skip ? '' : children },
    { skip }
  ));

  loading || productLoading;

  if (typeof children === 'object') {
    product = children;
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <SkeletonText className="text-sm" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <Link
            to={`/dashboard/products/${product?.id}`}
            className="relative text-sm font-medium text-gray-700 transition-all hover:underline underline-offset-2 hover:text-gray-900 dark:text-gray-300"
          >
            {product?.name}
          </Link>
        </div>
      </div>
    </>
  );
}
