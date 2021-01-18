import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, current_agency_Q, agency_customers_Q } from '@duely/client';
import { useBreakpoints, Table, DropMenu, Card, LoadingScreen, ErrorScreen } from '@duely/react';
import { ConfirmCustomerDeletionModal } from './components';
import { DashboardSection } from '../components';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

const wrap = {
  columns: 1,
  spans: [1, 1]
};

const headers = ['Customer', 'Action'];

export default function DashboardCustomersHome() {
  const { data: agency, loading: agencyLoading, error: agencyError } = useQuery(current_agency_Q);
  const { data: customers, loading: customersLoading, error: customersError } = useQuery(
    agency_customers_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );
  const { sm } = useBreakpoints();

  const loading = agencyLoading || customersLoading;
  const error = agencyError ?? customersError;

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  type TCustomer = NonNullable<typeof customers> extends readonly (infer T)[] ? T : never;

  const columns = [
    // customer name & email address
    (customer: TCustomer) => (
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium text-gray-800">{customer.name}</span>
        <span className="text-xs font-medium text-gray-800">{customer.email_address}</span>
      </div>
    ),

    // actions
    (customer: TCustomer) => {
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
          to: `customers/${customer.id}/edit`
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
          to: '?delete_customer=' + customer.id
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
      <DashboardSection title="Customers">
        <Card className="max-w-screen-lg">
          <Table
            className="px-6 py-4"
            rows={customers}
            columns={columns}
            headers={headers}
            wrap={wrap}
          />
        </Card>
      </DashboardSection>

      <ConfirmCustomerDeletionModal />
    </>
  );
}
