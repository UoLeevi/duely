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
  const ref = useRef<HTMLDivElement>(null);
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
        <div className="text-gray-400 animate-pulse">{icons['box.solid']}</div>
        <SkeletonText className="text-sm" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Link to={`/dashboard/products/${product?.id}`} className="relative text-gray-400">
          {icons['box.solid']}
        </Link>

        <div ref={ref}>
          <Link
            to={`/dashboard/products/${product?.id}`}
            className={`relative font-medium transition-all hover:underline underline-offset-2 hover:text-gray-900 ${className}`}
          >
            {product?.name}
          </Link>
        </div>

        <Tooltip elementRef={ref} position="bottom center">
          <div className="grid grid-flow-row grid-cols-[auto_auto] text-xs">
            <div className="py-1 pl-2 pr-1 font-medium border-t border-black/5">ID</div>
            <div className="py-1 pl-1 pr-2 font-mono border-t border-black/5">{product?.id}</div>
          </div>
        </Tooltip>
      </div>
    </>
  );
}
