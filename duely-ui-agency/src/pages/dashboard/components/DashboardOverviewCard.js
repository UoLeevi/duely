import React from 'react';
import { BsAward, BsInfoCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Card } from '@duely/react';

export function DashboardOverviewCard({ title, value, to, info }) {
  return (
    <Card className="h-full">
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
      <div className="rounded-md-b px-4 py-2 bg-gray-100">
        <Link to={to}><span className="text-sm font-semibold text-indigo-600">View all</span></Link>
      </div>
    </Card>
  );
}
