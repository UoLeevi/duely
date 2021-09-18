import { Card } from '@duely/react';
import {
  BalanceTransactionsTable,
  DashboardSection
} from '../../components';

export default function DashboardPaymentsTransactions() {
  return (
    <>
      <DashboardSection title="Transactions">
        <Card className="max-w-screen-lg">
          <BalanceTransactionsTable />
        </Card>
      </DashboardSection>
    </>
  );
}
