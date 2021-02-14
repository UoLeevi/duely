import React, { useCallback } from 'react';
import { useQuery, useMutation, customer_Q, delete_customer_M } from '@duely/client';
import { ConfirmationModal } from '@duely/react';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useHistory, useLocation } from 'react-router-dom';
import produce from 'immer';
import { usePrevious } from 'hooks';

export function ConfirmCustomerDeletionModal() {
  // Get customer id from url query string and replace history entry if cancelled
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let customer_id = searchParams.get('delete_customer');
  const show = customer_id != null;
  const prev = usePrevious(customer_id);
  customer_id = customer_id ?? prev;

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
      show={show}
      confirm={confirmDeletion}
      cancel={close}
      heading="Delete customer"
      confirmText="Delete"
      color="red"
      icon={<BsExclamationTriangle />}
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
