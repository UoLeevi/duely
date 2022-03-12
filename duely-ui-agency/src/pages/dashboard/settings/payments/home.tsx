import { useQuery, current_agency_Q, agency_stripe_account_bank_accounts_Q } from '@duely/client';
import {
  useBreakpoints,
  Table,
  DropMenu,
  SkeletonText,
  LinkButton,
  ColoredChip,
  icons,
  Section
} from '@duely/react';
import { ConfirmBankAccountDeletionModal } from './components';
import { CountryCode, countryFromCode } from '@duely/util';

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
      <Section className="max-w-screen-lg">
        <Section.Heading as="h2">Bank accounts</Section.Heading>
        <Section.Action>
          <LinkButton
            dense
            color="indigo"
            to="payments/new-bank-account"
            icon="plus.solid"
            className="text-sm"
          >
            Create bank account
          </LinkButton>
        </Section.Action>

        <Table wrap={{ md: 4 }} loading={loading} error={error} items={bank_accounts} keyField="id">
          <Table.Column header="Account holder" span={{ md: 2 }}>
            {(bank_account: TBankAccount | null) =>
              !bank_account ? (
                <div className="flex space-x-2">
                  <SkeletonText className="text-sm" />
                </div>
              ) : (
                <div className="flex space-x-2">
                  <span
                    className="text-sm text-gray-500"
                    title={bank_account.account_holder_type ?? ''}
                  >
                    {
                      icons[
                        bank_account.account_holder_type === 'company'
                          ? 'office-building.solid'
                          : 'user.solid'
                      ]
                    }
                  </span>

                  <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                    {bank_account.account_holder_name}
                  </span>
                </div>
              )
            }
          </Table.Column>

          <Table.Column header="Bank" span={{ md: 2 }}>
            {(bank_account: TBankAccount | null) =>
              !bank_account ? (
                <div className="flex space-x-2">
                  <SkeletonText className="text-sm" />
                  <SkeletonText className="text-sm" ch={2} />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                    {bank_account.bank_name}
                  </span>
                  <span
                    className="font-mono text-sm font-medium text-gray-800 dark:text-gray-300"
                    title={countryFromCode(bank_account.country as CountryCode).name}
                  >
                    {countryFromCode(bank_account.country as CountryCode).flag}
                  </span>
                </div>
              )
            }
          </Table.Column>

          <Table.Column header="Bank account" span={{ md: 2 }}>
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
                  {bank_account.default_for_currency && <ColoredChip text="default" color="blue" />}
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

          <Table.Column shrink>
            {(bank_account: TBankAccount | null) => {
              if (!bank_account) {
                return <div className="text-gray-300 animate-pulse">{icons['dots-vertical']}</div>;
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
      </Section>

      <ConfirmBankAccountDeletionModal />
    </>
  );
}
