import React, { useCallback } from 'react';
import { useQuery, useMutation, customer_Q, delete_customer_M } from '@duely/client';
import { Modal, Button, SkeletonParagraph } from '@duely/react';
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

  const { data: customer, loading: loadingCustomer } = useQuery(customer_Q, { customer_id: customer_id! }, { skip: !customer_id });
  const [deleteCustomer, { loading }] = useMutation(delete_customer_M);

  const close = useCallback(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('delete_customer');

    const location = produce(history.location, location => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    history.replace(location);
  }, [history]);

  async function confirmDeletion(e: React.MouseEvent) {
    e.preventDefault();
    const res = await deleteCustomer({ customer_id: customer_id! });
    if (res?.success) close();
  };

  return (
    <Modal show={show} className="max-w-lg rounded-lg">
      <div className="flex p-6 space-x-4 bg-white rounded-t-lg">
        <div className="grid w-10 h-10 text-xl text-red-700 bg-red-100 rounded-full place-items-center">
          <BsExclamationTriangle />
        </div>
        <div className="flex flex-col flex-1 space-y-4 w-96 min-w-min">
          <span className="text-xl font-medium">Delete customer</span>

          {loadingCustomer ? <SkeletonParagraph className="text-sm" /> : (
            <p className="text-sm text-gray-600">Are you sure you want to delete customer <span className="font-semibold">{customer?.name}</span>? The customer will be permanently removed. This action cannot be undone.</p>
          )}
        </div>
      </div>
      <div className="flex flex-row-reverse px-6 py-4 space-x-4 space-x-reverse rounded-b-lg bg-gray-50">
        <Button type="button" onClick={confirmDeletion} dense loading={loading} spinner className="text-sm font-medium text-white bg-red-600 hover:bg-red-700">
          Delete
        </Button>
        <Button type="button" onClick={close} dense className="text-sm text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-100">
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
