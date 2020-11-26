import React, { useCallback } from 'react';
import { useQuery, current_agency_Q } from '@duely/client';
import { Util, useBreakpoints, Table, DropMenu, Card } from '@duely/react';
import {
  DashboardFlexGrid,
  DashboardCardGetStartedCreateServices,
  DashboardSection
} from '../components';
import { BsExclamationTriangle, BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Modal } from 'components/Modal';
import produce from 'immer';

const statusChipClassNames = {
  draft: 'bg-orange-100 text-orange-800',
  live: 'bg-green-100 text-green-800'
};

const wrap = {
  columns: 5,
  spans: [
    5,
    2, 3
  ]
};

const headers = [
  'Service',
  'Status',
  'Action'
];

function ConfirmServiceDeletionModal() {
  // Get service id from url query string and replace history entry if cancelled
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const service_id = searchParams.get('delete_service');
  const show = service_id != null;

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

export default function DashboardServicesHome() {
  const { data: agency } = useQuery(current_agency_Q);
  const { sm } = useBreakpoints();

  const rows = agency?.services.map(service => {
    const { default_variant } = service;
    const { default_price } = default_variant;

    return {
      key: service.id,
      service,
      variant: default_variant,
      price: default_price
    };
  });

  const columns = [
    // service name & description
    item => (
      <div className="flex space-x-6">
        <div className="w-32 h-20 bg-gray-200 rounded-lg flex-shrink-0">
          {/* image */}
        </div>
        <div className="flex flex-col space-y-1">
          <span className="font-medium">{item.service.name}</span>
          <p className="text-xs text-gray-500 flex-1">{item.variant.description}</p>
          <div className="h-4 flex items-center space-x-2 text-gray-500 text-xs pb-3">{item.price && (
            <span>{Util.formatCurrency(item.price.unit_amount / 100, item.price.currency)}</span>
          )}
          </div>
        </div>
      </div>
    ),

    // service variant status
    item => (
      <div className="flex font-medium">
        <span className={`w-16 px-3 rounded-md text-center text-xs tracking-wider leading-7 capitalize ${statusChipClassNames[item.variant.status]}`}>{item.variant.status}</span>
      </div>
    ),

    // actions
    item => {
      const actions = [
        {
          key: 'edit',
          className: 'className="text-center text-sm text-gray-500 focus:text-gray-700 focus:outline-none hover:text-accent',
          children: (
            <div className="flex items-center space-x-2">
              <BsPencilSquare />
              <span>Edit</span>
            </div>
          ),
          to: '#edit/' + item.service.id
        },
        {
          key: 'delete',
          className: 'className="text-center text-sm text-gray-500 focus:text-gray-700 focus:outline-none hover:text-accent',
          children: (
            <div className="flex items-center space-x-2">
              <BsTrash />
              <span>Delete</span>
            </div>
          ),
          to: '?delete_service=' + item.service.id
        }
      ];

      return (
        <div className="flex font-medium space-x-6">
          {sm && (
            <DropMenu>
              {actions.map(action => <Link {...action} />)}
            </DropMenu>
          )}

          {!sm && actions.map(action => <Link {...action} />)}
        </div>
      );
    },
  ];

  return (
    <>
      <DashboardSection title="Get started">
        <DashboardFlexGrid>
          <DashboardCardGetStartedCreateServices />
        </DashboardFlexGrid>
      </DashboardSection>

      <DashboardSection title="Services">
        <Card>
          <Table className="px-6 py-4" rows={rows} columns={columns} headers={headers} wrap={wrap} />
        </Card>
      </DashboardSection>

      <ConfirmServiceDeletionModal />
    </>
  );
}
