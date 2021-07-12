import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, current_agency_Q, image_Q } from '@duely/client';
import { Util, useBreakpoints, Table, DropMenu, Card, useDynamicNavigation } from '@duely/react';
import { ConfirmProductDeletionModal } from './components';
import {
  DashboardFlexGrid,
  DashboardCardGetStartedCreateProducts,
  DashboardSection
} from '../components';
import { Currency } from '@duely/core';
import { ColoredChip } from '../components/ColoredChip';

const statusColors = {
  draft: 'orange',
  live: 'green'
};

const wrap = {
  columns: 5,
  spans: [5, 2, 3]
};

const headers = ['Product', 'Status', 'Action'];

export default function DashboardProductsHome() {
  const { data: agency } = useQuery(current_agency_Q);
  const { sm } = useBreakpoints();
  const passAccessToken = useDynamicNavigation({ passAccessToken: true });

  const rows =
    agency?.products?.map((product) => {
      const { default_price } = product;

      return {
        key: product.id,
        product,
        price: default_price
      };
    }) ?? [];

  type TItem = typeof rows extends readonly (infer T)[] ? T : never;

  const columns = [
    // product name & description
    (item: TItem) => {
      const { data: image_logo, loading: image_logoLoading } = useQuery(image_Q, { image_id: item.product?.image_logo?.id! }, { skip: !item.product?.image_logo });

      return (
        <div className="flex space-x-6">
          {image_logo ? (
            <img
              className="object-cover w-32 h-20 rounded-lg flex-shrink-1"
              src={image_logo.data}
              alt={`${item.product.name} logo`}
            />
          ) : (
            <div className="w-32 h-20 bg-gray-200 rounded-lg flex-shrink-1"></div>
          )}

          <div className="flex flex-col space-y-1">
            <span className="font-medium">{item.product.name}</span>
            <p className="flex-1 text-xs text-gray-500">
              {Util.truncate(item.product.description ?? '', 120)}
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
                target={`preview ${item.product.url_name}`}
                href={`https://${agency?.subdomain.name}.duely.app/checkout/${item.product.url_name}?preview`}
              >
                preview checkout
              </a>
            </div>
          </div>
        </div>
      );
    },

    // product product status
    (item: TItem) => <ColoredChip color={statusColors} text={item.product.status} />,

    // actions
    (item: TItem) => {
      const actions = [
        {
          key: 'edit',
          className:
            'text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800',
          children: (
            <div className="flex items-center space-x-2">
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <span>Edit</span>
            </div>
          ),
          to: `products/${item.product.url_name}/edit`
        },
        {
          key: 'delete',
          className:
            'text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800',
          children: (
            <div className="flex items-center space-x-2">
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete</span>
            </div>
          ),
          to: '?delete_product=' + item.product.id
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
          <DashboardCardGetStartedCreateProducts />
        </DashboardFlexGrid>
      </DashboardSection>

      <DashboardSection title="Products">
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

      <ConfirmProductDeletionModal />
    </>
  );
}
