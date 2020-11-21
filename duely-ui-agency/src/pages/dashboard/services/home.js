import React from 'react';
import { useQuery, current_agency_Q } from '@duely/client';
import { Util, useBreakpoints, Table } from '@duely/react';
import {
  DashboardFlexGrid,
  DashboardCard,
  DashboardCardGetStartedCreateServices,
  DashboardSection
} from '../components';
import { BsPencilSquare, BsThreeDotsVertical, BsTrash } from 'react-icons/bs';
import { Link } from 'react-router-dom';

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
          children: (
            <div className="flex items-center space-x-2 text-center text-sm text-gray-500 hover:text-accent">
              <BsPencilSquare />
              <span>Edit</span>
            </div>
          ),
          to: '#edit/' + item.service.id
        },
        {
          key: 'delete',
          children: (
            <div className="flex items-center space-x-2 text-center text-sm text-gray-500 hover:text-accent">
              <BsTrash />
              <span>Delete</span>
            </div>
          ),
          to: '#delete/' + item.service.id
        }
      ];

      return (
        <div className="flex font-medium space-x-6">
          {sm && <BsThreeDotsVertical className="text-xl text-gray-500" />}
          {!sm && actions.map(action => (
            <Link {...action} />
          ))}
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
        <DashboardCard>
          <Table className="px-6 py-4" rows={rows} columns={columns} headers={headers} wrap={wrap} />
        </DashboardCard>
      </DashboardSection>
    </>
  );
}
