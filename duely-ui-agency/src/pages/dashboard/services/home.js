import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, current_agency_Q } from '@duely/client';
import { Util, useBreakpoints, Table, DropMenu, Card, useDynamicNavigation } from '@duely/react';
import { ConfirmServiceDeletionModal } from './components';
import { DashboardFlexGrid, DashboardCardGetStartedCreateServices, DashboardSection } from '../components';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

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

export default function DashboardServicesHome() {
  const { data: agency } = useQuery(current_agency_Q);
  const { sm } = useBreakpoints();
  const passAccessToken = useDynamicNavigation({ passAccessToken: true });

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

        {item.variant.image_logo
          ? <img className="w-32 h-20 rounded-lg flex-shrink-1 object-cover" src={item.variant.image_logo.data} alt={`${item.variant.name} logo`} />
          : <div className="w-32 h-20 rounded-lg flex-shrink-1 bg-gray-200"></div>
        }

        <div className="flex flex-col space-y-1">
          <span className="font-medium">{item.service.name}</span>
          <p className="text-xs text-gray-500 flex-1 overflow-ellipsis">{item.variant.description}</p>
          <div className="flex items-center space-x-3 text-gray-500 text-xs pb-1">
            {item.price && (
              <span>{Util.formatCurrency(item.price.unit_amount / 100, item.price.currency)}</span>
            )}

            <a className="rounded-sm px-1 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600" onClick={passAccessToken} target={`preview ${item.service.url_name}`} href={`https://${agency.subdomain.name}.duely.app/checkout/${item.service.url_name}?preview`} >preview checkout</a>
            
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
        <Card className="max-w-screen-lg">
          <Table className="px-6 py-4" rows={rows} columns={columns} headers={headers} wrap={wrap} />
        </Card>
      </DashboardSection>

      <ConfirmServiceDeletionModal />
    </>
  );
}
