import React from 'react';
import { Util, Table, Card } from '@duely/react';
import { useQuery, agency_stripe_account_balance_transactions_Q, current_agency_Q } from '@duely/client';
import {
  DashboardFlexGrid,
  DashboardCardGetStartedCreateServices,
  DashboardCardGetStartedEnablePayouts,
  DashboardCardBalance,
  DashboardOverviewCard,
  DashboardSection
} from './components';

function DashboardSectionRecentTransactions() {
  const { data: agency } = useQuery(current_agency_Q);
  const { data: balance_transactions, loading, error } = useQuery(agency_stripe_account_balance_transactions_Q, { agency_id: agency.id });

  const headers = [
    'Type',
    'Date',
    'Description',
    'Amount',
    'Status',
  ];

  const columns = [
    // type
    tx => (
      <div className="text-sm font-semibold">{tx.reporting_category}</div>
    ),

    // date
    tx => (
      <div className="text-sm">{Util.formatDate(new Date(tx.created))}</div>
    ),

    // description
    tx => (
      <div className="text-sm">{tx.description}</div>
    ),

    // amount
    tx => (
      <div className="flex flex-col">
        <div className="text-sm">{Util.formatCurrency(tx.amount / 100, tx.currency)}</div>
        <div className="text-xs text-gray-500">net {Util.formatCurrency(tx.net / 100, tx.currency)}</div>
      </div>
    ),

    // status
    tx => (
      <div className="flex flex-col">
        <div className="text-sm">{tx.status}</div>
        {tx.status === 'pending' && (
          <div className="text-xs text-gray-500">available on {Util.formatDate(new Date(tx.available_on))}</div>
        )}
      </div>
    ),
  ];

  return (
    <DashboardSection title="Recent transactions">
      <Card>
        <Table className="px-6 py-4" rows={balance_transactions} columns={columns} headers={headers} dense={true} loading={loading} error={error} />
      </Card>
    </DashboardSection>
  );
}

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
          <DashboardCardGetStartedCreateServices />
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

      <DashboardSectionRecentTransactions />
    </>
  );
}
