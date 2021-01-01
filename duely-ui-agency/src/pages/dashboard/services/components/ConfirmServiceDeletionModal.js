import React, { useCallback } from 'react';
import { useQuery, useMutation, service_Q, delete_service_M } from '@duely/client';
import { Modal, Button, SkeletonParagraph } from '@duely/react';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useHistory, useLocation } from 'react-router-dom';
import produce from 'immer';
import { usePrevious } from 'hooks';

export function ConfirmServiceDeletionModal() {
  // Get service id from url query string and replace history entry if cancelled
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let service_id = searchParams.get('delete_service');
  const show = service_id != null;
  const prev = usePrevious(service_id);
  service_id = service_id ?? prev;

  const { data: service, loading: loadingService } = useQuery(service_Q, { service_id }, { skip: !service_id });
  const [deleteService, { loading, error }] = useMutation(delete_service_M);

  const close = useCallback(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('delete_service');

    const location = produce(history.location, location => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    history.replace(location);
  }, [history]);

  async function confirmDeletion(e) {
    e.preventDefault();
    const res = await deleteService({ service_id });
    if (res.success) close();
  };

  return (
    <Modal show={show} className="max-w-lg rounded-lg">
      <div className="flex p-6 space-x-4 bg-white rounded-t-lg">
        <div className="grid w-10 h-10 text-xl text-red-700 bg-red-100 rounded-full place-items-center">
          <BsExclamationTriangle />
        </div>
        <div className="flex flex-col flex-1 space-y-4 w-96 min-w-min">
          <span className="text-xl font-medium">Delete service</span>

          {loadingService ? <SkeletonParagraph className="text-sm" /> : (
            <p className="text-sm text-gray-600">Are you sure you want to delete service <span className="font-semibold">{service?.name}</span>? The service will be permanently removed. This action cannot be undone.</p>
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
