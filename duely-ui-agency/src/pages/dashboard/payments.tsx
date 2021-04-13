import { Card } from '@duely/react';
import {
  BalanceTransactionsTable,
  DashboardCardGetStartedEnablePayouts,
  DashboardFlexGrid,
  DashboardSection
} from './components';

export default function DashboardPayments() {
  return (
    <>
      <DashboardSection title="Get started">
        <DashboardFlexGrid>
          <DashboardCardGetStartedEnablePayouts />
        </DashboardFlexGrid>
      </DashboardSection>

      <DashboardSection title="Payments">
        <Card className="table">
          <BalanceTransactionsTable />
        </Card>
      </DashboardSection>
    </>
  );
}
