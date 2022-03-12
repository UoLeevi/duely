import { Card, Section } from '@duely/react';
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

      <Section className="max-w-screen-lg">
        <Section.Heading as="h2">Overview</Section.Heading>
        <DashboardFlexGrid>
          <DashboardCardBalance />
        </DashboardFlexGrid>
      </Section>

      <Section className="max-w-screen-lg">
        <Section.Heading as="h2">Recent transactions</Section.Heading>
        <BalanceTransactionsTable />
      </Section>
    </>
  );
}
