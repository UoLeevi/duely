import { Link } from 'react-router-dom';
import { useQuery, current_agency_Q, orders_Q, agency_stripe_account_Q } from '@duely/client';
import {
  useBreakpoints,
  Table,
  DropMenu,
  Card,
  LoadingScreen,
  ErrorScreen,
  Util
} from '@duely/react';
import { DashboardSection } from '../components';
import { BsPencilSquare } from 'react-icons/bs';
import { Currency } from '@duely/core';

const wrap = {
  columns: 1,
  spans: [1, 1, 1, 1]
};

const headers = ['Order', 'Customer', 'Amount', 'Action'];

export default function DashboardOrdersHome() {
  const { data: agency, loading: agencyLoading, error: agencyError } = useQuery(current_agency_Q);
  const {
    data: stripe_account,
    loading: stripe_accountLoading,
    error: stripe_accountError
  } = useQuery(
    agency_stripe_account_Q,
    {
      agency_id: agency!.id
    },
    { skip: !agency }
  );
  const { data: orders, loading: ordersLoading, error: ordersError } = useQuery(
    orders_Q,
    {
      filter: {
        stripe_account_id: stripe_account?.id
      }
    },
    { skip: !agency || !stripe_account }
  );

  const { sm } = useBreakpoints();

  const loading = agencyLoading || ordersLoading || stripe_accountLoading;
  const error = agencyError ?? ordersError ?? stripe_accountError;

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  type TOrder = NonNullable<typeof orders> extends readonly (infer T)[] ? T : never;

  const columns = [
    // product name & order id
    (order: TOrder) => (
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium text-gray-800">
          {Util.truncate(order.items.map((item) => item.price.product.name).join(', '), 50)}
        </span>
        <span className="text-xs text-gray-600">{order.id}</span>
      </div>
    ),

    // customer info
    (order: TOrder) => (
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium text-gray-800">{order.customer.name ?? order.customer.email_address.split('@')[0]}</span>
        <span className="text-xs text-gray-800">{order.customer.email_address}</span>
      </div>
    ),

    // amount info
    (order: TOrder) => (
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium text-gray-800">
          {Currency.format(
            order.items.reduce((sum, item) => sum + item.price.unit_amount, 0),
            order.items[0].price.currency as Currency
          )}
        </span>
      </div>
    ),

    // actions
    (order: TOrder) => {
      const actions = [
        {
          key: 'edit',
          className:
            'text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800',
          children: (
            <div className="flex items-center space-x-2">
              <BsPencilSquare />
              <span>Edit</span>
            </div>
          ),
          to: `orders/${order.id}/edit`
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
      <DashboardSection title="Orders">
        <Card className="max-w-screen-lg">
          <Table
            className="px-6 py-4"
            rows={orders}
            columns={columns}
            headers={headers}
            wrap={wrap}
          />
        </Card>
      </DashboardSection>
    </>
  );
}
