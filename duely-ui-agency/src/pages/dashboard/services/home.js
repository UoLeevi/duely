import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, current_agency_Q } from '@duely/client';
import { Util, useBreakpoints, Table, DropMenu, Card, useDynamicNavigation } from '@duely/react';
import { ConfirmServiceDeletionModal } from './components';
import { DashboardFlexGrid, DashboardCardGetStartedCreateServices, DashboardSection } from '../components';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Currency } from '@duely/core';

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

function formatPrice(price) {
  let text = Currency.format(price.unit_amount, price.currency);

  if (price.type === 'recurring') {
    const count = price.recurring_interval_count;
    text += count > 1
      ? ` every ${count} ${price.recurring_interval}s`
      : ` every ${price.recurring_interval}`;
  }

  return text;
}

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
          ? <img className="object-cover w-32 h-20 rounded-lg flex-shrink-1" src={item.variant.image_logo.data} alt={`${item.variant.name} logo`} />
          : <div className="w-32 h-20 bg-gray-200 rounded-lg flex-shrink-1"></div>
        }

        <div className="flex flex-col space-y-1">
          <span className="font-medium">{item.service.name}</span>
          <p className="flex-1 text-xs text-gray-500">{Util.truncate(item.variant.description, 120)}</p>
          <div className="flex items-center pb-1 space-x-3 text-xs text-gray-500">
            {item.price && (
              <span>{formatPrice(item.price)}</span>
            )}

            <a className="px-1 rounded-sm hover:text-indigo-600 focus:outline-none focus-visible:text-indigo-600" onClick={passAccessToken} target={`preview ${item.service.url_name}`} href={`https://${agency.subdomain.name}.duely.app/checkout/${item.service.url_name}?preview`} >preview checkout</a>

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
          className: 'className="text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-accent',
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
          className: 'className="text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-accent',
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
        <div className="flex space-x-6 font-medium">
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
