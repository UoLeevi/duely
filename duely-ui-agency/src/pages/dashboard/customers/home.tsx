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
  LinkButton,
  icons
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
              { icons.pencil }
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
              { icons.trash }
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
