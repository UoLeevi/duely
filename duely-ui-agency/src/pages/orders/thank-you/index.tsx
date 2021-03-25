import { useQuery, current_agency_Q, orders_Q } from '@duely/client';
import { Currency } from '@duely/core';
import { Card, LoadingScreen } from '@duely/react';
import { Link, useLocation } from 'react-router-dom';
import NotFound from '../../not-found';

export default function ThankYouPage() {
  // Get stripe checkout session id from url query string
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const session_id = searchParams.get('session_id');

  const { data: current_agency, loading: current_agencyLoading } = useQuery(current_agency_Q);
  const { data: orders, loading: orderLoading } = useQuery(
    orders_Q,
    { filter: { stripe_checkout_session_id_ext: session_id } },
    { skip: !session_id }
  );

  const loading = current_agencyLoading || orderLoading;

  if (!session_id) {
    return <NotFound />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (orders?.length !== 1) {
    return <NotFound />;
  }

  // TODO: Show order info

  return (
    <>
      <div className="grid h-full place-items-center bg-gray-25">
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

          <Card>
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex flex-col">
                <span className="w-full text-sm font-bold tracking-wide">
                  Keyword Research Service
                </span>
              </div>
              <div className="flex flex-row items-center justify-between text-xs">
                {Currency.format(150000, 'USD')}
              </div>
            </div>
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
