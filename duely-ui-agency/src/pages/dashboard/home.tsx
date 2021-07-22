import { Card } from '@duely/react';
import {
  DashboardFlexGrid,
  DashboardCardBalance,
  DashboardSection,
  BalanceTransactionsTable
} from './components';
import { DashboardGetStartedSection } from './components/DashboardGetStartedSection';

export default function DashboardHome() {

  return (
    <>
      <DashboardGetStartedSection />

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
