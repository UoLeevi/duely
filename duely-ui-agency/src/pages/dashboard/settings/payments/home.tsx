import { Link } from 'react-router-dom';
import { useQuery, current_agency_Q, agency_stripe_account_bank_accounts_Q } from '@duely/client';
import {
  useBreakpoints,
  Table,
  DropMenu,
  Card,
  SkeletonText,
  LinkButton,
  ColoredChip,
  icons
} from '@duely/react';
import { ConfirmBankAccountDeletionModal } from './components';
import { DashboardSection } from '../../components';

const wrap = {
  xs: {
    columns: 2,
    spans: [2, 1, 1]
  }
};

const headers = ['Bank account', 'Currency', 'Action'];

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
    // bank_account number
    (bank_account: TBankAccount | null) =>
      !bank_account ? (
        <div className="flex items-center h-8 space-x-4 min-h-min">
          <SkeletonText className="text-base" />
        </div>
      ) : (
        <div className="flex items-center h-8 space-x-4 min-h-min">
          <span className="font-mono text-base font-medium text-gray-800 dark:text-gray-300">
            ********{bank_account.last4}
          </span>
          {bank_account.default_for_currency && <ColoredChip text="default" color="blue" />}
        </div>
      ),

    // currency
    (bank_account: TBankAccount | null) =>
      !bank_account ? (
        <div className="flex items-center h-8 space-x-4 min-h-min">
          <SkeletonText className="text-sm" />
        </div>
      ) : (
        <div className="flex items-center h-8 space-x-4 min-h-min">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
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
              { icons.trash }
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
            <LinkButton
              dense
              color="indigo"
              to="payments/new-bank-account"
              icon="plus.solid"
              className="text-sm"
            >
              New bank account
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
            items={bank_accounts}
          />
        </Card>
      </DashboardSection>

      <ConfirmBankAccountDeletionModal />
    </>
  );
}
