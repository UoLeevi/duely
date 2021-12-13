import React, { useCallback, useEffect } from 'react';
import {
  useQuery,
  useMutation,
  coupon_Q,
  delete_coupon_M,
  current_agency_Q,
  agency_stripe_account_Q
} from '@duely/client';
import { ConfirmationModal, useModal, usePrevious } from '@duely/react';
import { useHistory, useLocation } from 'react-router-dom';
import produce from 'immer';

export function ConfirmCouponDeletionModal() {
  // Get coupon id from url query string and replace history entry if cancelled
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let coupon_id = searchParams.get('delete_coupon');

  const { data: agency, loading: agencyLoading } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency?.id! },
    { skip: !agency }
  );

  const show = coupon_id != null;
  const prev = usePrevious(coupon_id);
  coupon_id = coupon_id ?? prev;

  const modal = useModal(false);

  useEffect(() => {
    if (show !== modal.isOpen) {
      if (show) modal.open();
      else modal.close();
    }
  }, [show, modal]);

  const { data: coupon, loading: loadingCoupon } = useQuery(
    coupon_Q,
    { stripe_account_id: stripe_account?.id!, coupon_id: coupon_id! },
    { skip: !coupon_id || !stripe_account }
  );
  const [deleteCoupon] = useMutation(delete_coupon_M);

  const close = useCallback(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('delete_coupon');

    const location = produce(history.location, (location) => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    history.replace(location);
  }, [history]);

  async function confirmDeletion(e: React.MouseEvent) {
    e.preventDefault();
    const res = await deleteCoupon({
      stripe_account_id: stripe_account!.id,
      coupon_id: coupon_id!
    });
    if (res?.success) close();
  }

  return (
    <ConfirmationModal
      control={modal}
      confirm={confirmDeletion}
      cancel={close}
      heading="Delete coupon"
      confirmText="Delete"
      color="red"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      }
      loading={loadingCoupon}
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to delete the coupon? This action cannot be undone.
      </p>
    </ConfirmationModal>
  );
}
