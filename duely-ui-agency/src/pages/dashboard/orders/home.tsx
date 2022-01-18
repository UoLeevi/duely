import {
  useQuery,
  orders_Q,
  count_orders_Q,
  order_details_Q,
  agency_stripe_account_Q,
  current_agency_Q
} from '@duely/client';
import {
  useBreakpoints,
  Table,
  DropMenu,
  Card,
  usePagination,
  SkeletonText,
  ColoredChip,
  icons,
  useQueryState,
  PropertyValue
} from '@duely/react';
import { DashboardSection } from '../components';
import { Currency, formatCurrency, formatDate, truncate } from '@duely/util';

export default function DashboardOrdersHome() {
  const { data: agency, control: agencyControl } = useQueryState(current_agency_Q);
  const {
    data: stripe_account,
    loading: agencyLoading,
    error: agencyError,
    control: stripeAccountControl
  } = useQueryState(agency_stripe_account_Q);

  type TOrder = NonNullable<ReturnType<typeof orders_Q.result>> extends readonly (infer T)[]
    ? T
    : never;

  const pagination = usePagination<TOrder, 'id'>({
    getTotalNumberOfItems: () => {
      const {
        data: count_orders,
        loading: count_ordersLoading,
        error
      } = useQuery(
        count_orders_Q,
        {
          filter: {
            stripe_account_id: stripe_account?.id
          }
        },
        { skip: !agency || !stripe_account }
      );

      return {
        count: count_orders ?? -1,
        loading: agencyLoading || count_ordersLoading,
        error
      };
    },
    getPageItems: ({ itemsPerPage, firstIndex }) => {
      const { data, loading, error } = useQuery(
        orders_Q,
        {
          filter: {
            stripe_account_id: stripe_account?.id
          },
          limit: itemsPerPage === 0 ? undefined : itemsPerPage,
          offset: firstIndex < 0 ? 0 : firstIndex
        },
        { skip: !agency || !stripe_account }
      );

      return { items: data ?? [], loading, error };
    },
    itemsPerPage: 5
  });

  const { sm } = useBreakpoints();

  const loading = agencyLoading || pagination.loading;
  const error = agencyError ?? pagination.error;

  return (
    <>
      <DashboardSection title="Orders">
        <Card className="max-w-screen-lg">
          <Table
            loading={loading}
            error={error}
            wrap={{
              md: 8
            }}
            pagination={pagination}
            keyField="id"
            rowLink={(order: TOrder) => ({ to: `orders/${order.id}` })}
          >
            <Table.Column header="Order" span={3}>
              {(order: TOrder | null) =>
                !order ? (
                  <div className="flex flex-col space-y-1">
                    <SkeletonText className="text-sm" />
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {truncate(order.items.map((item) => item.price.product.name).join(', '), 50)}
                    </span>
                    <div className="flex items-center h-8 space-x-4 min-h-min">
                      <span className="font-mono text-sm text-gray-600">{order.id}</span>
                      {order.state !== 'processed' && (
                        <ColoredChip color={statusColors} text={order.state} />
                      )}
                    </div>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Customer" span={3}>
              {(order: TOrder | null) =>
                !order ? (
                  <div className="flex flex-col space-y-1">
                    <SkeletonText className="text-sm" />
                    <SkeletonText className="text-xs" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {order.customer.name ?? order.customer.email_address.split('@')[0]}
                    </span>
                    <span className="text-xs text-gray-800 dark:text-gray-300">
                      {order.customer.email_address}
                    </span>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Type" span={2}>
              {(order: TOrder | null) =>
                !order ? (
                  <div className="flex flex-col space-y-1">
                    <ColoredChip color={{}} />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      <ColoredChip
                        color={{
                          subscription: 'blue',
                          payment: 'green'
                        }}
                        text={order.stripe_checkout_session.mode!}
                      />
                    </span>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Amount" span={3}>
              {(order: TOrder | null) =>
                !order ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-2">
                      <SkeletonText className="text-sm" ch={8} />
                    </div>
                    <ColoredChip color={paymentStatusColors} />
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                        {formatCurrency(
                          order.stripe_checkout_session.amount_total ?? 0,
                          order.stripe_checkout_session.currency as Currency
                        )}
                      </span>
                    </div>
                    <ColoredChip
                      color={paymentStatusColors}
                      icon={
                        order.stripe_checkout_session.payment_status === 'paid'
                          ? 'check.solid'
                          : undefined
                      }
                      text={order.stripe_checkout_session.payment_status ?? undefined}
                    />
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Order date" span={2}>
              {(order: TOrder | null) =>
                !order ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-xs" />
                  </div>
                ) : (
                  <PropertyValue.Date>{order.ordered_at}</PropertyValue.Date>
                )
              }
            </Table.Column>

            <Table.Column shrink justify="right">
              {(order: TOrder | null) => {
                if (!order) {
                  return (
                    <div className="text-gray-300 animate-pulse">{icons['dots-vertical']}</div>
                  );
                }

                return (
                  <DropMenu>
                    <DropMenu.Item icon={icons.pencil} to={`orders/${order.id}/edit`}>
                      Edit
                    </DropMenu.Item>
                    <OrderActionsViewReceiptDropMenuItem order_id={order.id} />
                  </DropMenu>
                );
              }}
            </Table.Column>
          </Table>
        </Card>
      </DashboardSection>
    </>
  );
}

type OrderActionsViewReceiptDropMenuItemProps = {
  order_id: string;
};

function OrderActionsViewReceiptDropMenuItem({
  order_id
}: OrderActionsViewReceiptDropMenuItemProps) {
  const {
    data: order,
    loading: orderLoading,
    error: orderError
  } = useQuery(order_details_Q, {
    order_id
  });

  console.log(order);

  const receipt_url =
    order?.stripe_checkout_session.mode === 'payment'
      ? order?.stripe_checkout_session.payment_intent?.charges?.[0]?.receipt_url ?? undefined
      : order?.stripe_checkout_session.subscription?.latest_invoice?.hosted_invoice_url ??
        undefined;

  return (
    <DropMenu.Item icon={icons['receipt-tax']} href={receipt_url} loading={orderLoading}>
      <span className="flex-1 text-left">View receipt</span>
      <span className="mr-auto text-gray-400 transition-colors group-hover:text-gray-800">
        {icons['external-link.solid']}
      </span>
    </DropMenu.Item>
  );
}

const statusColors = {
  pending: 'orange-text',
  processing: 'blue-text',
  processed: 'green-text',
  failed: 'red-text'
};

const paymentStatusColors = {
  unpaid: 'orange',
  paid: 'green'
};

// type OrderStatusColumnProps = {
//   order: OrderFragment;
// };

// function OrderStatusColumn({ order }: OrderStatusColumnProps) {
//   const dropMenu = useDropMenu();

//   return (
//     <div className="flex">
//       <DropMenu
//         origin="center"
//         control={dropMenu.control}
//         button={
//           <div className="p-2">
//             <ColoredChip
//               color={statusColors}
//               text={order.state}
//             />
//           </div>
//         }
//       >
//         <ChangeOrderStatusForm status={order.state} order_id={order.id} onDone={dropMenu.close} />
//       </DropMenu>
//     </div>
//   );
// }

// type ChangeOrderStatusFormProps = {
//   order_id: string;
//   status: string;
//   onDone: () => void;
// };

// type UpdateOrderStatusFormFields = {
//   status: keyof typeof orderStatuses;
// };

// function ChangeOrderStatusForm({ order_id, status, onDone }: ChangeOrderStatusFormProps) {
//   const otherStatuses = Object.keys(orderStatuses).filter(
//     (processingState) => processingState !== status
//   );

//   // TODO
//   const form = useForm<UpdateOrderStatusFormFields>();

//   const {
//     infoMessage,
//     setInfoMessage,
//     successMessage,
//     setSuccessMessage,
//     errorMessage,
//     setErrorMessage
//   } = useFormMessages();

//   async function onSubmit({ ...data }: UpdateOrderStatusFormFields) {
//     // const res = await updateOrder({ order_id, ...data });

//     // if (res?.success) {
//     //   setSuccessMessage('Saved');
//     //   return;
//     // } else {
//     //   setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
//     // }
//     console.log(data);
//     onDone();
//   }

//   return (
//     <Form form={form} onSubmit={onSubmit}>
//       <div className="flex flex-col pb-2 space-y-2">
//         <div>
//           <span className="text-xs font-medium text-gray-800 dark:text-gray-300 whitespace-nowrap">
//             Change status
//           </span>
//         </div>
//         {otherStatuses.map((processingState) => (
//           <ChangeOrderStatusButton status={processingState} key={processingState} />
//         ))}
//       </div>
//     </Form>
//   );
// }

// type ChangeOrderStatusButtonProps = {
//   status: string;
// };

// function ChangeOrderStatusButton({ status }: ChangeOrderStatusButtonProps) {
//   const form = useFormContext();
//   return (
//     <button value={status} {...form.register('status')}>
//       <ColoredChip
//         color={statusColors}
//         text={orderStatuses[status as keyof typeof orderStatuses]}
//       />
//     </button>
//   );
// }
