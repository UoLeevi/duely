import React from 'react';
import { Util, Table, Card } from '@duely/react';
import {
  DashboardFlexGrid,
  DashboardCardGetStartedCreateProducts,
  DashboardCardGetStartedEnablePayouts,
  DashboardCardBalance,
  DashboardOverviewCard,
  DashboardSection,
  BalanceTransactionsTable
} from './components';

export default function DashboardHome() {

  const headers = [
    'Event',
    'Info',
    'Date'
  ];

  const rows = [
    {
      event: 'Sale',
      info: 'Lili has bought Keyword research',
      date: Util.formatDate(new Date())
    },
    {
      event: 'Sale',
      info: 'Leevi has bought Keyword research',
      date: Util.formatDate(new Date())
    },
    {
      event: 'File upload',
      info: 'Leevi has shared a file Content-brief.txt',
      date: Util.formatDate(new Date())
    },
  ];

  const columns = [
    // event
    item => (
      <div className="text-sm font-semibold">{item.event}</div>
    ),

    // info
    item => (
      <div className="text-sm">{item.info}</div>
    ),

    // date
    item => (
      <div className="text-sm">{item.date}</div>
    ),
  ];

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
          <DashboardOverviewCard title="Sales" value="$1,000.00 USD" to="#" info="last 30 days" />
          <DashboardOverviewCard title="Active projects" value="5 projects" to="#" info="last 30 days" />
        </DashboardFlexGrid>
      </DashboardSection>

      <DashboardSection title="Recent activity">
        <Card>
          <Table className="px-6 py-4" rows={rows} columns={columns} headers={headers} dense={true} />
        </Card>
      </DashboardSection>

      <DashboardSection title="Recent transactions">
        <Card>
          <BalanceTransactionsTable />
        </Card>
      </DashboardSection>
    </>
  );
}
