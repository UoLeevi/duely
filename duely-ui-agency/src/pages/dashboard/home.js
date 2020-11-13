import { Util } from '@duely/react';
import { BsAward, BsInfoCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { DashboardCard } from './components';

function DashboardOverviewCard({ title, value, to, info }) {
  return (
    <DashboardCard className="h-full">
      <div className="flex flex-row flex-1 rounded-md-t p-4 items-center space-x-4">
        <BsAward className="text-2xl text-gray-500" />
        <div className="flex flex-col flex-1 space-y-1">
          <div className="flex flex-row items-center space-x-4">
            <h3 className="font-semibold text-gray-600 flex-1">{title}</h3>
            <BsInfoCircle className="text-gray-500" />
          </div>
          <div className="flex flex-row items-center space-x-4">
            <span className="font-medium text-gray-800 flex-1">{value}</span>
            <span className="font-medium text-green-400">+ 5%</span>
          </div>
          <span className="text-sm self-end text-gray-500 font-medium -mb-2 mt-1">{info}</span>
        </div>
      </div>
      <div className="rounded-md-b px-4 py-2 bg-gray-200">
        <Link to={to}><span className="text-sm font-semibold text-indigo-600">View all</span></Link>
      </div>
    </DashboardCard>
  );
}

function Cell({ children }) {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3 box-border">
      { children}
    </div>
  );
}

export default function DashboardHome() {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold  ml-2 mb-2">Overview</h2>
        <div className="flex flex-row -m-1 flex-wrap">
          <Cell><DashboardOverviewCard title="Sales" value="$1,000.00 USD" to="#" info="last 30 days" /></Cell>
          <Cell><DashboardOverviewCard title="Active projects" value="5 projects" to="#" info="last 30 days" /></Cell>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold ml-2 mb-2">Recent activity</h2>
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
        </div>
      </div>
    </>
  );
}
