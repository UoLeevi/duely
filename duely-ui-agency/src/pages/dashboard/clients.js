import { Util } from '@duely/react';
import { DashboardCard } from './components';

export default function DashboardClients() {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold ml-2 mb-2">Clients</h2>
        <div className="p-2">
          <DashboardCard className="table">
            <div className="table-row-group">
              <div className="table-row bg-gray-200 text-indigo-600 font-medium text-sm">
                <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-gray-300">Event</div>
                <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-gray-300">Info</div>
                <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-gray-300">Date</div>
              </div>
              <div className="table-row border-b">
                <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200 font-semibold">Sale</div>
                <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200">Lili has bought Keyword research</div>
                <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200">{Util.formatDate(new Date())}</div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </>
  );
}
