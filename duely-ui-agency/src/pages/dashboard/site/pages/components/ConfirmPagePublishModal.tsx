import React, { useCallback, useEffect } from 'react';
import { useQuery, useMutation, page_Q, update_page_M } from '@duely/client';
import { ConfirmationModal, useModal, usePrevious } from '@duely/react';
import { useHistory, useLocation } from 'react-router-dom';
import produce from 'immer';
import { AccessLevel } from '@duely/core';

export function ConfirmPagePublishModal() {
  // Get page id from url query string and replace history entry if cancelled
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let page_id = searchParams.get('publish') ?? searchParams.get('unpublish');
  const show = page_id != null;
  const prev = usePrevious(page_id);
  page_id = page_id ?? prev;

  const modal = useModal(false);

  useEffect(() => {
    if (show !== modal.isOpen) {
      if (show) modal.open();
      else modal.close();
    }
  }, [show, modal]);

  const { data: page, loading: loadingPage } = useQuery(
    page_Q,
    { page_id: page_id! },
    { skip: !page_id }
  );
  const [updatePage] = useMutation(update_page_M);

  const close = useCallback(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('publish');
    searchParams.delete('unpublish');

    const location = produce(history.location, (location) => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    history.replace(location);
  }, [history]);

  const published = page?.access === AccessLevel.Public;

  async function confirmPublish(e: React.MouseEvent) {
    e.preventDefault();
    const res = await updatePage({
      page_id: page_id!,
      access: published ? AccessLevel.Agent : AccessLevel.Public
    });
    if (res?.success) close();
  }

  return (
    <ConfirmationModal
      control={modal}
      confirm={confirmPublish}
      cancel={close}
      heading={published ? 'Unpublish page' : 'Publish page'}
      confirmText={published ? 'Unpublish' : 'Publish'}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
      loading={loadingPage}
    >
      {published && (
        <p className="text-sm text-gray-600">
          Are you sure you want to unpublish the page with URL:
          <br />
          <span className="font-semibold">{page?.url_path}</span>
          <br />
          The page would marked as draft and not be visible to public.
        </p>
      )}

      {!published && (
        <p className="text-sm text-gray-600">
          Are you sure you want to publish the page with URL:
          <br />
          <span className="font-semibold">{page?.url_path}</span>
          <br />
          The page would be marked as live and visible to public.
        </p>
      )}
    </ConfirmationModal>
  );
}
