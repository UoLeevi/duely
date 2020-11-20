import React from 'react';
import { Util } from '@duely/react';
import {
  DashboardFlexGrid,
  DashboardCard,
  DashboardCardGetStartedCreateServices,
  DashboardCardGetStartedEnablePayouts,
  DashboardOverviewCard,
  DashboardSection
} from './components';

export default function DashboardHome() {
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
          <DashboardOverviewCard title="Sales" value="$1,000.00 USD" to="#" info="last 30 days" />
          <DashboardOverviewCard title="Active projects" value="5 projects" to="#" info="last 30 days" />
        </DashboardFlexGrid>
      </DashboardSection>

      <DashboardSection title="Recent activity">
        <DashboardCard className="table">
          <div className="table-row-group">
            <div className="table-row bg-gray-100 text-indigo-600 font-medium text-sm">
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-gray-300">Event</div>
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-gray-300">Info</div>
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-gray-300">Date</div>
            </div>
            <div className="table-row border-b">
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200 font-semibold">Sale</div>
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200">Lili has bought Keyword research</div>
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200">{Util.formatDate(new Date())}</div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200 font-semibold">Sale</div>
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200">Leevi has bought Keyword research</div>
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200">{Util.formatDate(new Date())}</div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200 font-semibold">File upload</div>
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200">Leevi has shared a file Content-brief.txt</div>
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200">{Util.formatDate(new Date())}</div>
            </div>
          </div>
        </DashboardCard>
      </DashboardSection>
    </>
  );
}
