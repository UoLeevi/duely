import React, { useCallback } from 'react';
import { useQuery, useMutation, page_Q, update_page_M } from '@duely/client';
import { Modal, Button, SkeletonParagraph } from '@duely/react';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useHistory, useLocation } from 'react-router-dom';
import produce from 'immer';
import { usePrevious } from 'hooks';
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

  const { data: page, loading: loadingPage } = useQuery(
    page_Q,
    { page_id: page_id! },
    { skip: !page_id }
  );
  const [updatePage, { loading }] = useMutation(update_page_M);

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
    <Modal show={show} className="max-w-lg rounded-lg">
      <div className="flex p-6 space-x-4 bg-white rounded-t-lg">
        <div className="grid w-10 h-10 text-xl text-indigo-600 bg-indigo-100 rounded-full place-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex flex-col flex-1 space-y-4 w-96 min-w-min">
          <span className="text-xl font-medium">
            {published ? 'Unpublish page' : 'Publish page'}
          </span>

          {loadingPage ? (
            <SkeletonParagraph className="text-sm" />
          ) : published ? (
            <p className="text-sm text-gray-600">
              Are you sure you want to unpublish page{' '}
              <span className="font-semibold">{page?.url_path}</span> ? <br />
              The page would marked as draft and not be visible to public.
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Are you sure you want to publish page{' '}
              <span className="font-semibold">{page?.url_path}</span> ? <br />
              The page would be marked as live and visible to public.
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-row-reverse px-6 py-4 space-x-4 space-x-reverse rounded-b-lg bg-gray-50">
        <Button
          type="button"
          onClick={confirmPublish}
          dense
          loading={loading}
          spinner
          className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {published ? 'Unpublish' : 'Publish'}
        </Button>
        <Button
          type="button"
          onClick={close}
          dense
          className="text-sm text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-100"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
