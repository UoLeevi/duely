import { Card } from '@duely/react';
import {
  DashboardFlexGrid,
  DashboardCardGetStartedCreateProducts,
  DashboardCardGetStartedEnablePayouts,
  DashboardCardBalance,
  DashboardSection,
  BalanceTransactionsTable
} from './components';

export default function DashboardHome() {

  return (
    <>
      <DashboardSection title="Get started">
        <DashboardFlexGrid>
          <DashboardCardGetStartedEnablePayouts />
          <DashboardCardGetStartedCreateProducts />
        </DashboardFlexGrid>
      </DashboardSection>

      <DashboardSection title="Overview">
        <DashboardFlexGrid>
          <DashboardCardBalance />
        </DashboardFlexGrid>
      </DashboardSection>

      <DashboardSection title="Recent transactions">
        <Card>
          <BalanceTransactionsTable />
        </Card>
      </DashboardSection>
    </>
  );
}
