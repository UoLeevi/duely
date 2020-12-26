import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, current_agency_Q } from '@duely/client';
import { Util, useBreakpoints, Table, DropMenu, Card, useDynamicNavigation } from '@duely/react';
import { ConfirmServiceDeletionModal } from './components';
import {
  DashboardFlexGrid,
  DashboardCardGetStartedCreateServices,
  DashboardSection
} from '../components';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Currency } from '@duely/core';
import { ColoredChip } from '../components/ColoredChip';

const statusColors = {
  draft: 'orange',
  live: 'green'
}

const wrap = {
  columns: 5,
  spans: [5, 2, 3]
};

const headers = ['Service', 'Status', 'Action'];

export default function DashboardServicesHome() {
  const { data: agency } = useQuery(current_agency_Q);
  const { sm } = useBreakpoints();
  const passAccessToken = useDynamicNavigation({ passAccessToken: true });

  const rows =
    agency?.services?.map((service) => {
      const { default_variant } = service;
      const { default_price } = default_variant;

      return {
        key: service.id,
        service,
        variant: default_variant,
        price: default_price
      };
    }) ?? [];

  // type TItem = ReturnType<typeof getServiceRow>;

  type TItem = typeof rows extends readonly (infer T)[] ? T : never;

  const columns = [
    // service name & description
    (item: TItem) => (
      <div className="flex space-x-6">
        {item.variant.image_logo ? (
          <img
            className="object-cover w-32 h-20 rounded-lg flex-shrink-1"
            src={item.variant.image_logo.data}
            alt={`${item.variant.name} logo`}
          />
        ) : (
          <div className="w-32 h-20 bg-gray-200 rounded-lg flex-shrink-1"></div>
        )}

        <div className="flex flex-col space-y-1">
          <span className="font-medium">{item.service.name}</span>
          <p className="flex-1 text-xs text-gray-500">
            {Util.truncate(item.variant.description ?? '', 120)}
          </p>
          <div className="flex items-center pb-1 space-x-3 text-xs text-gray-500">
            {item.price && (
              <span>
                {Currency.format(item.price.unit_amount, item.price.currency as Currency)}
              </span>
            )}

            <a
              className="px-1 rounded-sm hover:text-indigo-600 focus:outline-none focus-visible:text-indigo-600"
              onClick={passAccessToken}
              target={`preview ${item.service.url_name}`}
              href={`https://${agency?.subdomain.name}.duely.app/checkout/${item.service.url_name}?preview`}
            >
              preview checkout
            </a>
          </div>
        </div>
      </div>
    ),

    // service variant status
    (item: TItem) => (
      <ColoredChip color={statusColors} text={item.variant.status} />
    ),

    // actions
    (item: TItem) => {
      const actions = [
        {
          key: 'edit',
          className:
            'className="text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800',
          children: (
            <div className="flex items-center space-x-2">
              <BsPencilSquare />
              <span>Edit</span>
            </div>
          ),
          to: `services/${item.service.url_name}/edit`
        },
        {
          key: 'delete',
          className:
            'className="text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800',
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
              {actions.map((action) => (
                <Link {...action} />
              ))}
            </DropMenu>
          )}

          {!sm && actions.map((action) => <Link {...action} />)}
        </div>
      );
    }
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
          <Table
            className="px-6 py-4"
            rows={rows}
            columns={columns}
            headers={headers}
            wrap={wrap}
          />
        </Card>
      </DashboardSection>

      <ConfirmServiceDeletionModal />
    </>
  );
}
