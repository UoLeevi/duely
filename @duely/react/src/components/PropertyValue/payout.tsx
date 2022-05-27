import React, { useId, useRef } from 'react';
import { createClassName } from '@duely/util';
import { TimeConversionTooltip, Tooltip } from '../Tooltip';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';
import { useQuery, agency_stripe_account_Q } from '@duely/client';
import { icons } from '../icons';
import { Link } from 'react-router-dom';

export type PayoutPropertyValueProps = {
  children: string | null | undefined;
};

export function PayoutPropertyValue({ children: payout_id }: PayoutPropertyValueProps) {
  const tooltipId = useId();
  let { loading } = useQueryState();
  let { data: stripe_account } = useQueryState(agency_stripe_account_Q);
  const className = 'text-sm text-gray-700 dark:text-gray-300';

  // const { data: payout, loading: payoutLoading } = useQuery(
  //   payout_Q,
  //   { payout_id: payout_id!, stripe_account_id: stripe_account?.id! },
  //   { skip: loading || !payout_id || !stripe_account?.id }
  // );

  const payout = {id: payout_id};
  const payoutLoading = false;

  loading ||= payoutLoading;

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-gray-400 animate-pulse">{icons['payout.solid']}</div>
        <SkeletonText className="text-sm" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Link to={`/dashboard/payouts/${payout?.id}`} className="relative text-gray-400">
          {icons['payout.solid']}
        </Link>

        <div data-tooltip={tooltipId}>
          <Link
            to={`/dashboard/payouts/${payout?.id}`}
            className={`relative font-medium transition-all hover:underline underline-offset-2 space-x-2 hover:text-gray-900 ${className}`}
          >
            <span>Payout</span>
          </Link>
        </div>

        <Tooltip id={tooltipId} position="bottom center">
          <div className="grid grid-flow-row grid-cols-[auto_auto] text-xs">
            <div className="py-1 pl-2 pr-1 font-medium border-t border-black/5">ID</div>
            <div className="py-1 pl-1 pr-2 font-mono border-t border-black/5">{payout?.id}</div>
          </div>
        </Tooltip>
      </div>
    </>
  );
}
