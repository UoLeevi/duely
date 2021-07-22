import { Card } from '@duely/react';
import {
  BalanceTransactionsTable,
  DashboardSection
} from './components';

export default function DashboardPayments() {
  return (
    <>
      <DashboardSection title="Payments">
        <Card className="table">
          <BalanceTransactionsTable />
        </Card>
      </DashboardSection>
    </>
  );
}
