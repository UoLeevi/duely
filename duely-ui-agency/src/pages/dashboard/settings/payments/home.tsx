import { Link } from 'react-router-dom';
import { useQuery, current_agency_Q, agency_stripe_account_bank_accounts_Q } from '@duely/client';
import { useBreakpoints, Table, DropMenu, Card, Button, SkeletonText } from '@duely/react';
import { ConfirmBankAccountDeletionModal } from './components';
import { DashboardSection } from '../../components';

const wrap = {
  columns: 1,
  spans: [1, 1]
};

const headers = ['Bank account', 'Action'];

export default function DashboardSettingsPaymentsHome() {
  const { data: agency, loading: agencyLoading, error: agencyError } = useQuery(current_agency_Q);

  type TBankAccount = NonNullable<
    ReturnType<typeof agency_stripe_account_bank_accounts_Q.result>
  > extends readonly (infer T)[]
    ? T
    : never;

  const {
    data: bank_accounts,
    loading: bank_accountsLoading,
    error: bank_accountsError
  } = useQuery(
    agency_stripe_account_bank_accounts_Q,
    {
      agency_id: agency?.id!
    },
    { skip: !agency }
  );

  const { sm } = useBreakpoints();

  const loading = agencyLoading || bank_accountsLoading;
  const error = agencyError ?? bank_accountsError;

  const columns = [
    // bank_account number and currency
    (bank_account: TBankAccount | null) =>
      !bank_account ? (
        <div className="flex flex-col space-y-2">
          <SkeletonText className="text-sm" />
          <SkeletonText className="text-xs" />
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <span className="font-mono text-sm font-medium text-gray-800 dark:text-gray-300">
            ********{bank_account.last4}
          </span>
          <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
            {bank_account.currency.toUpperCase()}
          </span>
        </div>
      ),

    // actions
    (bank_account: TBankAccount | null) => {
      if (!bank_account) {
        return <SkeletonText />;
      }

      const actions = [
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
          to: '?delete_bank_account=' + bank_account.id
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
        title="Bank accounts"
        actions={
          <div className="flex flex-row justify-end">
            <Button dense color="green" className="text-sm">
              <Link to="payments/new-bank-account" className="flex space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 -ml-1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>New bank account</span>
              </Link>
            </Button>
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
            items={bank_accounts}
          />
        </Card>
      </DashboardSection>

      <ConfirmBankAccountDeletionModal />
    </>
  );
}
