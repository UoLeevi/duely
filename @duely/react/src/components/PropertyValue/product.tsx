import React, { useId, useRef } from 'react';
import { createClassName } from '@duely/util';
import { TimeConversionTooltip, Tooltip } from '../Tooltip';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';
import { useQuery, product_Q } from '@duely/client';
import { icons } from '../icons';
import { Link } from 'react-router-dom';

export type ProductPropertyValueProps = {
  children: string | null | undefined;
};

export function ProductPropertyValue({ children: product_id }: ProductPropertyValueProps) {
  const tooltipId = useId();
  let { loading } = useQueryState();
  const className = 'text-sm text-gray-700 dark:text-gray-300';

  const { data: product, loading: productLoading } = useQuery(
    product_Q,
    { product_id: product_id! },
    { skip: loading || !product_id }
  );

  loading ||= productLoading;

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
        <Link to={`/dashboard/products/${product?.url_name}`} className="relative text-gray-400">
          {icons['box.solid']}
        </Link>

        <div data-tooltip={tooltipId}>
          <Link
            to={`/dashboard/products/${product?.url_name}`}
            className={`relative font-medium transition-all hover:underline underline-offset-2 hover:text-gray-900 ${className}`}
          >
            {product?.name}
          </Link>
        </div>

        <Tooltip id={tooltipId} position="bottom center">
          <div className="grid grid-flow-row grid-cols-[auto_auto] text-xs">
            <div className="py-1 pl-2 pr-1 font-medium border-t border-black/5">ID</div>
            <div className="py-1 pl-1 pr-2 font-mono border-t border-black/5">{product?.id}</div>
          </div>
        </Tooltip>
      </div>
    </>
  );
}
