import React, { useCallback } from 'react';
import { useQuery, current_agency_Q } from '@duely/client';
import { Modal } from '@duely/react';
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

  const { data: agency } = useQuery(current_agency_Q);

  const service = service_id && agency?.services.find(service => service.id === service_id);

  const close = useCallback(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('delete_service');

    const location = produce(history.location, location => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    history.replace(location);
  }, [history]);

  return (
    <Modal show={show} className="max-w-lg rounded-lg">
      <div className="flex bg-white p-6 space-x-4 rounded-t-lg">
        <div className="w-10 h-10 grid place-items-center text-xl rounded-full bg-red-100 text-red-700">
          <BsExclamationTriangle />
        </div>
        <div className="flex flex-col space-y-4 flex-1">
          <span className="text-xl font-medium">Delete service</span>
          <p className="text-gray-600 text-sm">Are you sure you want to delete service <span className="font-semibold">{service?.name}</span>? The service will be permanently removed. This action cannot be undone.</p>
        </div>
      </div>
      <div className="flex bg-gray-50 px-6 py-4 space-x-4 rounded-b-lg">
        <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
          Delete
        </button>
        <button type="button" onClick={close} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
          Cancel
        </button>
      </div>
    </Modal>
  );
}
