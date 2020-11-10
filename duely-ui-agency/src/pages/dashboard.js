import DashboardLayout from 'components/DashboardLayout';
import { BsAward } from 'react-icons/bs';
import { Link } from 'react-router-dom';
// import TopBar from 'components/TopBar';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <div className="flex flex-row -m-2">
          <div className="m-2 flex flex-col flex-1 rounded-md bg-white border border-gray-300 shadow-sm">
            <div className="flex flex-row rounded-md-t p-4 items-center space-x-4">
              <BsAward className="text-2xl text-gray-500" />
              <div className="flex flex-col">
                <h3 className="font-semibold text-gray-600">Sales <span className="text-sm">(last 30 days)</span></h3>
                <span className="font-medium text-gray-800">$1,000.00 USD</span>
              </div>
            </div>
            <div className="rounded-md-b px-4 py-2 bg-gray-200">
              <Link to="#"><span className="text-sm font-semibold text-indigo-600">View all</span></Link>
            </div>
          </div>

          <div className="m-2 flex flex-col flex-1 rounded-md bg-white border border-gray-300 shadow-sm">
            <div className="flex flex-row rounded-md-t p-4 items-center space-x-4">
              <BsAward className="text-2xl text-gray-500" />
              <div className="flex flex-col">
                <h3 className="font-semibold text-gray-600">Sales</h3>
                <span className="font-medium text-gray-800">$1,000.00 USD</span>
              </div>
            </div>
            <div className="rounded-md-b px-4 py-2 bg-gray-200">
              <Link to="#"><span className="text-sm font-semibold text-indigo-600">View all</span></Link>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
