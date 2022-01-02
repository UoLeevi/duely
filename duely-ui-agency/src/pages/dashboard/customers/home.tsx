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
  icons,
  useQueryState
} from '@duely/react';
import { ConfirmCustomerDeletionModal } from './components';
import { DashboardSection } from '../components';

export default function DashboardCustomersHome() {
  const { data: agency, control: agencyControl } = useQueryState(current_agency_Q);
  const {
    data: stripe_account,
    loading: agencyLoading,
    error: agencyError,
    control: stripeAccountControl
  } = useQueryState(agency_stripe_account_Q);

  type TCustomer = NonNullable<ReturnType<typeof customers_Q.result>> extends readonly (infer T)[]
    ? T
    : never;

  const pagination = usePagination<TCustomer, 'id'>({
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
        loading: agencyLoading || count_customersLoading,
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

  const loading = agencyLoading || pagination.loading;
  const error = agencyError ?? pagination.error;

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
            wrap={{ xs: 2 }}
            loading={loading}
            error={error}
            pagination={pagination}
            keyField="id"
          >
            <Table.Column header="Customer">
              {(customer: TCustomer | null) =>
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
                )
              }
            </Table.Column>

            <Table.Column header="Action">
              {(customer: TCustomer | null) => {
                if (!customer) {
                  return <SkeletonText />;
                }

                return (
                  <DropMenu>
                    <DropMenu.Item icon={icons.pencil} to={`customers/${customer.id}/edit`}>
                      Edit
                    </DropMenu.Item>

                    <DropMenu.Item icon={icons.trash} to={'?delete_customer=' + customer.id}>
                      Delete
                    </DropMenu.Item>
                  </DropMenu>
                );
              }}
            </Table.Column>
          </Table>
        </Card>
      </DashboardSection>

      <ConfirmCustomerDeletionModal />
    </>
  );
}
