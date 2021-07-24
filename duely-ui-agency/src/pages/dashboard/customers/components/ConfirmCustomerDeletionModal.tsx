import React, { useCallback, useEffect } from 'react';
import { useQuery, useMutation, customer_Q, delete_customer_M } from '@duely/client';
import { ConfirmationModal, useModal } from '@duely/react';
import { useHistory, useLocation } from 'react-router-dom';
import produce from 'immer';
import { usePrevious } from '~/hooks';

export function ConfirmCustomerDeletionModal() {
  // Get customer id from url query string and replace history entry if cancelled
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let customer_id = searchParams.get('delete_customer');
  const show = customer_id != null;
  const prev = usePrevious(customer_id);
  customer_id = customer_id ?? prev;

  const modal = useModal(false);

  useEffect(() => {
    if (show !== modal.isOpen) {
      if (show) modal.open();
      else modal.close();
    }
  }, [show, modal]);

  const { data: customer, loading: loadingCustomer } = useQuery(
    customer_Q,
    { customer_id: customer_id! },
    { skip: !customer_id }
  );
  const [deleteCustomer] = useMutation(delete_customer_M);

  const close = useCallback(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('delete_customer');

    const location = produce(history.location, (location) => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    history.replace(location);
  }, [history]);

  async function confirmDeletion(e: React.MouseEvent) {
    e.preventDefault();
    const res = await deleteCustomer({ customer_id: customer_id! });
    if (res?.success) close();
  }

  return (
    <ConfirmationModal
      control={modal}
      confirm={confirmDeletion}
      cancel={close}
      heading="Delete customer"
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
      loading={loadingCustomer}
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to delete customer{' '}
        <span className="font-semibold">{customer?.name ?? customer?.email_address}</span>? The
        customer will be permanently removed. This action cannot be undone.
      </p>
    </ConfirmationModal>
  );
}
