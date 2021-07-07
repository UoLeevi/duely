import { Link } from 'react-router-dom';
import { useQuery, current_agency_Q, orders_Q, agency_stripe_account_Q } from '@duely/client';
import {
  useBreakpoints,
  Table,
  DropMenu,
  Card,
  LoadingScreen,
  ErrorScreen,
  Util,
  useForm,
  Form,
  useFormContext,
  useDropMenu,
  useFormMessages
} from '@duely/react';
import { DashboardSection } from '../components';
import { Currency, OrderFragment } from '@duely/core';
import { ColoredChip } from '../components/ColoredChip';
import { useRef } from 'react';

const wrap = {
  columns: 2,
  spans: [2, 2, 1, 1, 1, 1]
};

const headers = ['Order', 'Customer', 'Amount', 'Order date', 'Status', 'Action'];

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
  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError
  } = useQuery(
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
        <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
          {Util.truncate(order.items.map((item) => item.price.product.name).join(', '), 50)}
        </span>
        <span className="text-xs text-gray-600">{order.id}</span>
      </div>
    ),

    // customer info
    (order: TOrder) => (
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
          {order.customer.name ?? order.customer.email_address.split('@')[0]}
        </span>
        <span className="text-xs text-gray-800 dark:text-gray-300">
          {order.customer.email_address}
        </span>
      </div>
    ),

    // amount info
    (order: TOrder) => (
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
          {Currency.format(
            order.items.reduce((sum, item) => sum + item.price.unit_amount, 0),
            order.items[0].price.currency as Currency
          )}
        </span>
      </div>
    ),

    // date & time
    (order: TOrder) => (
      <div className="flex flex-col space-y-2">
        <span className="text-xs text-gray-800 dark:text-gray-300">
          {Util.formatDate(new Date(order.ordered_at))}
        </span>
      </div>
    ),

    // product product status
    (order: TOrder) => <OrderStatusColumn order={order} />,

    // actions
    (order: TOrder) => {
      const actions = [
        {
          key: 'edit',
          className:
            'text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800 dark:text-gray-300',
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

const orderStatuses = {
  pending: 'not started',
  processing: 'started',
  processed: 'completed',
  failed: 'cancelled'
};

const statusColors = {
  'not started': 'orange',
  started: 'blue',
  completed: 'green',
  cancelled: 'gray'
};

type OrderStatusColumnProps = {
  order: OrderFragment;
};

function OrderStatusColumn({ order }: OrderStatusColumnProps) {
  const dropMenu = useDropMenu();

  return (
    <div className="flex">
      <DropMenu
        origin="center"
        control={dropMenu.control}
        button={
          <div className="p-2">
            <ColoredChip
              color={statusColors}
              text={orderStatuses[order.state as keyof typeof orderStatuses]}
            />
          </div>
        }
      >
        <ChangeOrderStatusForm status={order.state} order_id={order.id} onDone={dropMenu.close} />
      </DropMenu>
    </div>
  );
}

type ChangeOrderStatusFormProps = {
  order_id: string;
  status: string;
  onDone: () => void;
};

type UpdateOrderStatusFormFields = {
  status: keyof typeof orderStatuses
};

function ChangeOrderStatusForm({ order_id, status, onDone }: ChangeOrderStatusFormProps) {
  const otherStatuses = Object.keys(orderStatuses).filter(
    (processingState) => processingState !== status
  );

  // TODO
  const form = useForm<UpdateOrderStatusFormFields>();

  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  async function onSubmit({ ...data }: UpdateOrderStatusFormFields) {
    // const res = await updateOrder({ order_id, ...data });

    // if (res?.success) {
    //   setSuccessMessage('Saved');
    //   return;
    // } else {
    //   setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    // }
    console.log(data);
    onDone();
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="flex flex-col pb-2 space-y-2">
        <div>
          <span className="text-xs font-medium text-gray-800 dark:text-gray-300 whitespace-nowrap">
            Change status
          </span>
        </div>
        {otherStatuses.map((processingState) => (
          <ChangeOrderStatusButton status={processingState} key={processingState} />
        ))}
      </div>
    </Form>
  );
}

type ChangeOrderStatusButtonProps = {
  status: string;
};

function ChangeOrderStatusButton({ status }: ChangeOrderStatusButtonProps) {
  const form = useFormContext();
  return (
    <button value={status} {...form.register('status')}>
      <ColoredChip
        color={statusColors}
        text={orderStatuses[status as keyof typeof orderStatuses]}
      />
    </button>
  );
}
