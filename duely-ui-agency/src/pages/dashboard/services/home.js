import React from 'react';
import { Util } from '@duely/react';
import { useQuery, current_agency_Q } from '@duely/client';
import {
  DashboardFlexGrid,
  DashboardCard,
  DashboardCardGetStartedCreateServices,
  DashboardSection
} from '../components';
import { BsThreeDotsVertical } from 'react-icons/bs';

function formatCurrency(amount, currency, country_code) {
  currency = currency.toUpperCase();
  country_code = country_code ?? 'US';
  return new Intl.NumberFormat('en-' + country_code, {
    currency,
    style: 'currency',
  }).format(amount);
}

const statusChipClassNames = {
  draft: 'bg-orange-200 text-orange-700 shadow-sm',
  live: 'bg-green-200 text-green-700 shadow-sm'
};

function DataGrid({ getKey, rows, columns, headers, className }) {
  className = Util.createClassName(className, 'grid auto-rows-auto');

  return (
    <div className={className} style={{ gridTemplateColumns: `repeat(${columns.length}, auto)` }}>
      {headers.map((header, j) => (
        <React.Fragment key={j}>
          {header}
        </React.Fragment>
      ))}

      {rows.map((row, i) => (
        <React.Fragment key={getKey ? getKey(row) : i}>
          {columns.map((column, j) => (
            <React.Fragment key={j}>
              {column(row, i)}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function DashboardServicesHome() {
  const { loading, error, data: agency } = useQuery(current_agency_Q);

  console.log(agency);

  const headers = [
    (
      <div className="text-sm text-gray-500">
        <span>Service</span>
      </div>
    ),
    (
      <div className="text-sm text-gray-500 justify-self-center">
        <span>Status</span>
      </div>
    ),
    (
      <div className="text-sm text-gray-500 justify-self-end">
        <span>Actions</span>
      </div>
    ),
  ];

  const columns = [

    // service name & description
    r => (
      <div className="flex space-x-6">
        <div className="w-32 h-20 bg-gray-200 rounded-lg">
          {/* image */}
        </div>
        <div className="flex flex-col space-y-1">
          <span className="font-medium">{r.service.name}</span>
          <p className="text-xs text-gray-500 flex-1">{r.variant.description}</p>
          <div className="h-4 flex items-center space-x-2 text-gray-500 text-xs pb-3">{r.price && (
            <span>{formatCurrency(r.price.unit_amount / 100, r.price.currency)}</span>
          )}
          </div>
        </div>
      </div>
    ),

    // service variant status
    r => (
      <div className="flex font-medium items-center justify-self-center">
        <span className={`w-16 px-3 py-1 rounded-md text-center text-xs tracking-wider ${statusChipClassNames[r.variant.status]}`}>{r.variant.status}</span>
      </div>
    ),

    // service variant status
    r => (
      <div className="flex text-xl font-medium text-gray-500 items-center justify-self-end pr-1">
        <BsThreeDotsVertical />
      </div>
    ),
  ];

  const rows = agency?.services.map(service => {
    const { default_variant } = service;
    const { default_price } = default_variant;

    return {
      service,
      variant: default_variant,
      price: default_price
    };
  });

  return (
    <>
      <DashboardSection title="Get started">
        <DashboardFlexGrid>
          <DashboardCardGetStartedCreateServices />
        </DashboardFlexGrid>
      </DashboardSection>

      <DashboardSection title="Services">
        <DashboardCard>
          <DataGrid className="gap-6 px-6 pt-4 pb-6" getKey={r => r.service.id} rows={rows} columns={columns} headers={headers} />
        </DashboardCard>


        {/* <DashboardCard className="table">
          <div className="table-row-group">
            <div className="table-row bg-gray-200 text-indigo-600 font-medium text-sm">
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-gray-300">Service</div>
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-gray-300">Info</div>
              <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-gray-300">Date</div>
            </div>

            {agency?.services.map(service => (
              <div className="table-row border-b">
                <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200 font-semibold">{service.name}</div>
                <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200">Lili has bought Keyword research</div>
                <div className="table-cell px-4 py-2 text-sm border-r last:border-r-0 border-t border-gray-200">{Util.formatDate(new Date())}</div>
              </div>
            ))}
          </div>
        </DashboardCard> */}



        {/* <DashboardCard>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 tracking-wider">
                          No. of clients
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 tracking-wider">
                          Total Revenue
                        </th>
                        <th className="px-6 py-3 bg-gray-50"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">

                      {agency?.services.map(service => (
                        <tr key={service.id}>
                          <td className="px-6 py-4 whitespace-no-wrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-20 w-32">
                                <img className="h-20 w-32 rounded-xl object-cover"
                                  src="https://source.unsplash.com/random/800x600"
                                  alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm leading-5 font-medium text-gray-900">
                                  {service.name}
                                </div>
                                <div className="text-sm leading-5 text-gray-500">
                                  {service.default_variant.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap">
                            <div className="text-sm leading-5 text-gray-900">10</div>
                            <div className="text-sm leading-5 text-gray-500"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap">
                            <span
                              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {service.default_variant.status}
                          </span>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                            {service.default_variant.default_price?.unit_amount && `${service.default_variant.default_price.currency.toUpperCase()} ${service.default_variant.default_price.unit_amount / 100}`}
                      </td>
                          <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                            <a href="#" alt="" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard> */}

      </DashboardSection>
    </>
  );
}
