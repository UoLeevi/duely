import { Section } from '@duely/react';
import { BalanceTransactionsTable } from '../../components';

export default function DashboardPaymentsTransactions() {
  return (
    <>
      <Section className="max-w-screen-lg">
        <Section.Heading as="h2">Transactions</Section.Heading>
        <BalanceTransactionsTable />
      </Section>
    </>
  );
}
