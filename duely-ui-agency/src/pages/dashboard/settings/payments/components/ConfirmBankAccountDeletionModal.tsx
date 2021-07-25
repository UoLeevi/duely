import React, { useCallback, useEffect } from 'react';
import {
  useQuery,
  useMutation,
  delete_bank_account_M,
  current_agency_Q,
  agency_stripe_account_Q,
  agency_stripe_account_bank_accounts_Q
} from '@duely/client';
import { ConfirmationModal, useModal, usePrevious } from '@duely/react';
import { useHistory, useLocation } from 'react-router-dom';
import produce from 'immer';

export function ConfirmBankAccountDeletionModal() {
  // Get bank_account id from url query string and replace history entry if cancelled
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let bank_account_id = searchParams.get('delete_bank_account');
  const show = bank_account_id != null;
  const prev = usePrevious(bank_account_id);
  bank_account_id = bank_account_id ?? prev;

  const modal = useModal(false);

  useEffect(() => {
    if (show !== modal.isOpen) {
      if (show) modal.open();
      else modal.close();
    }
  }, [show, modal]);

  const { data: agency, loading: agencyLoading } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );

  const {
    data: bank_accounts,
    loading: bank_accountsLoading,
    error: bank_accountsError
  } = useQuery(
    agency_stripe_account_bank_accounts_Q,
    {
      agency_id: agency?.id!
    },
    { skip: !agency }
  );

  const bank_account = bank_accounts?.find((bank_account) => bank_account.id === bank_account_id);

  const [deleteBankAccount] = useMutation(delete_bank_account_M);

  const close = useCallback(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('delete_bank_account');

    const location = produce(history.location, (location) => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    history.replace(location);
  }, [history]);

  async function confirmDeletion(e: React.MouseEvent) {
    e.preventDefault();
    const res = await deleteBankAccount({
      stripe_account_id: stripe_account?.id!,
      bank_account_id: bank_account_id!
    });
    if (res?.success) close();
  }

  return (
    <ConfirmationModal
      control={modal}
      confirm={confirmDeletion}
      cancel={close}
      heading="Delete bank_account"
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
      loading={agencyLoading || stripe_accountLoading || bank_accountsLoading}
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to delete bank account{' '}
        <span className="font-mono font-semibold">********{bank_account?.last4}</span>? The bank
        account will be permanently removed. This action cannot be undone.
      </p>
    </ConfirmationModal>
  );
}
