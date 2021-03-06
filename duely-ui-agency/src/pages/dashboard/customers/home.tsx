import { Link } from 'react-router-dom';
import {
  useQuery,
  current_agency_Q,
  customers_Q,
  count_customers_Q,
  agency_stripe_account_Q
} from '@duely/client';
import {
  useBreakpoints,
  Table,
  DropMenu,
  Card,
  SkeletonText,
  usePagination,
  LinkButton
} from '@duely/react';
import { ConfirmCustomerDeletionModal } from './components';
import { DashboardSection } from '../components';

const wrap = {
  xs: {
    columns: 1,
    spans: [1, 1]
  }
};

const headers = ['Customer', 'Action'];

export default function DashboardCustomersHome() {
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

  type TCustomer = NonNullable<ReturnType<typeof customers_Q.result>> extends readonly (infer T)[]
    ? T
    : never;

  const pagination = usePagination<TCustomer>({
    getTotalNumberOfItems: () => {
      const {
        data: count_customers,
        loading: count_customersLoading,
        error
      } = useQuery(
        count_customers_Q,
        {
          filter: {
            stripe_account_id: stripe_account?.id
          }
        },
        { skip: !agency || !stripe_account }
      );

      return {
        count: count_customers ?? -1,
        loading: agencyLoading || stripe_accountLoading || count_customersLoading,
        error
      };
    },
    getPageItems: ({ itemsPerPage, firstIndex }) => {
      const { data, loading, error } = useQuery(
        customers_Q,
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

  const loading = agencyLoading || stripe_accountLoading || pagination.loading;
  const error = agencyError ?? stripe_accountError ?? pagination.error;

  const columns = [
    // customer name & email address
    (customer: TCustomer | null) =>
      !customer ? (
        <div className="flex flex-col space-y-2">
          <SkeletonText className="text-sm" />
          <SkeletonText className="text-xs" />
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
            {customer.name ?? customer.email_address.split('@')[0]}
          </span>
          <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
            {customer.email_address}
          </span>
        </div>
      ),

    // actions
    (customer: TCustomer | null) => {
      if (!customer) {
        return <SkeletonText />;
      }

      const actions = [
        {
          key: 'edit',
          className:
            'text-sm text-center text-gray-500 focus:text-gray-700 dark:focus:text-gray-300 focus:outline-none hover:text-gray-800 dark:hover:text-gray-200',
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
          to: `customers/${customer.id}/edit`
        },
        {
          key: 'delete',
          className:
            'text-sm text-center text-gray-500 focus:text-gray-700 dark:focus:text-gray-300 focus:outline-none hover:text-gray-800 dark:hover:text-gray-200',
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
      <DashboardSection
        title="Customers"
        actions={
          <div className="flex flex-row justify-end">
            <LinkButton
              dense
              color="indigo"
              to="customers/new-customer"
              icon="plus.solid"
              className="text-sm"
            >
              New customer
            </LinkButton>
          </div>
        }
      >
        <Card className="max-w-screen-lg">
          <Table
            columns={columns}
            headers={headers}
            wrap={wrap}
            loading={loading}
            error={error}
            pagination={pagination}
            footerPaginationControls
          />
        </Card>
      </DashboardSection>

      <ConfirmCustomerDeletionModal />
    </>
  );
}
