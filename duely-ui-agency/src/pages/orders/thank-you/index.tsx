import { useQuery, current_agency_Q, orders_Q } from '@duely/client';
import { Currency, ElementType, formatCurrency } from '@duely/util';
import { Card, LoadingScreen, Table, NotFoundScreen, SkeletonText } from '@duely/react';
import { Link, useLocation } from 'react-router-dom';

export default function ThankYouPage() {
  // Get stripe checkout session id from url query string
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const session_id = searchParams.get('session_id');

  const { data: current_agency, loading: current_agencyLoading } = useQuery(current_agency_Q);
  const { data: orders, loading: orderLoading } = useQuery(
    orders_Q,
    {
      filter: { stripe_checkout_session_id_ext: session_id },
      token: session_id
    },
    { skip: !session_id }
  );

  const loading = current_agencyLoading || orderLoading;

  if (!session_id) {
    return <NotFoundScreen />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (orders?.length !== 1) {
    return <NotFoundScreen />;
  }

  const order = orders[0];

  // TODO: Show order info

  return (
    <>
      <div className="flex flex-col items-center justify-center flex-1 bg-gray-25">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-3">
            <div className="grid self-center w-16 h-16 border-2 border-green-500 rounded-full bg-green-50 place-items-center">
              <svg
                className="h-12 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  className="animate-stroke-draw"
                  pathLength="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="mt-2 text-4xl font-bold">Thank you for your purchase!</h1>
            <p className="text-center text-gray-500">
              You should receive an order confirmation email shortly.
            </p>
          </div>

          <Card className="max-w-screen-lg">
            <Table items={order.items} wrap={{ lg: 2 }}>
              <Table.Column header="Item">
                {(order_item: ElementType<typeof order.items> | null) =>
                  !order_item ? (
                    <div className="flex flex-col space-y-2">
                      <SkeletonText className="text-sm" />
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm font-medium text-gray-800">
                        {order_item.price.product.name}
                      </span>
                    </div>
                  )
                }
              </Table.Column>

              <Table.Column header="Amount">
                {(order_item: ElementType<typeof order.items> | null) =>
                  !order_item ? (
                    <div className="flex flex-col space-y-2">
                      <SkeletonText className="text-sm" />
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm font-medium text-gray-800">
                        {formatCurrency(
                          order_item.price.unit_amount,
                          order_item.price.currency as Currency
                        )}
                      </span>
                    </div>
                  )
                }
              </Table.Column>
            </Table>
          </Card>

          <div className="flex flex-col">
            <p className="font-semibold">Merchant details:</p>
            <p className="">{current_agency?.name}</p>
            <p className="">support@duely.app</p>
          </div>

          <Link
            className="px-6 py-2.5 font-medium text-center text-white bg-indigo-500 rounded-md shadow-sm"
            to="/"
            replace={true}
          >
            Return to Merchant
          </Link>
        </div>
      </div>
    </>
  );
}
