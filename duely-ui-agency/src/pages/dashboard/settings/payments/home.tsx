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
    ,
    ,// bank_account number
    // currency
    // actions
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
          <Table wrap={wrap} loading={loading} error={error} items={bank_accounts}>
            <Table.Column header="Bank account">
              {(bank_account: TBankAccount | null) =>
                !bank_account ? (
                  <div className="flex items-center h-8 space-x-4 min-h-min">
                    <SkeletonText className="text-base" />
                  </div>
                ) : (
                  <div className="flex items-center h-8 space-x-4 min-h-min">
                    <span className="font-mono text-base font-medium text-gray-800 dark:text-gray-300">
                      ********{bank_account.last4}
                    </span>
                    {bank_account.default_for_currency && (
                      <ColoredChip text="default" color="blue" />
                    )}
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Currency">
              {(bank_account: TBankAccount | null) =>
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
                )
              }
            </Table.Column>

            <Table.Column header="Action">
              {(bank_account: TBankAccount | null) => {
                if (!bank_account) {
                  return <SkeletonText />;
                }

                return (
                  <DropMenu>
                    <DropMenu.Item icon={icons.trash} to={'?delete_bank_account=' + bank_account.id}>
                      Delete
                    </DropMenu.Item>
                  </DropMenu>
                );
              }}
            </Table.Column>
          </Table>
        </Card>
      </DashboardSection>

      <ConfirmBankAccountDeletionModal />
    </>
  );
}