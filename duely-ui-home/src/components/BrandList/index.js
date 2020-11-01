import MultiStatusIndicator, { status } from 'components/MultiStatusIndicator';
import useQuery from 'hooks/useQuery';

export default function BrandList() {
  const { loading, data, error } = useQuery('current_user_agencies');

  return (
    <table className="table-auto w-full max-w-screen-md">
      <thead className="text-xs sm:text-sm">
        <tr className="bg-gray-100 text-gray-600">
          <th className="pl-4 pr-2 sm:pr-4 py-3 rounded-l-lg text-left tracking-wide">Brand</th>
          <th className="hidden sm:table-cell px-2 sm:px-4 py-3 text-left tracking-wide">Owner</th>
          <th className="hidden sm:table-cell px-2 sm:px-4 py-3 text-left tracking-wide rounded-r-lg">Revenue</th>
          <th className="px-2 sm:px-4 py-3 text-left tracking-wide rounded-r-lg ">Account Status</th>
        </tr>
      </thead>
      <tbody className="text-sm sm:text-base">
        {loading && (
          <tr className="border-b-2">
            <td className="px-2 sm:px-4 py-4 border-none" colSpan="1000">
              <div className="flex items-center space-x-3">
                Loading...
              </div>
            </td>
          </tr>
        )}

        {error && (
          <tr className="border-b-2">
            <td className="px-2 sm:px-4 py-4 border-none" colSpan="1000">
              <div className="flex items-center space-x-3 text-red-600">
                {error.message}
              </div>
            </td>
          </tr>
        )}

        {data && data.map(agency => {
          const charges_enabled = agency.stripe_account.charges_enabled;
          const payouts_enabled = agency.stripe_account.payouts_enabled;

          const account_statuses = [
            { status: charges_enabled ? status.OK : status.ACTION_REQUIRED, key: 'charges_enabled' },
            { status: payouts_enabled ? status.OK : status.ACTION_REQUIRED, key: 'payouts_enabled' }
          ];

          return (
            <tr className="border-b-2" key={agency.id}>
              <td className="px-2 sm:px-4 py-4 border-none">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full h-12 w-12 sm:h-16 sm:w-16 bg-yellow-300 flex"></div>
                  <div className="flex flex-col justify-center">
                    <div className="font-medium">{agency.name}</div>
                    <a className="text-xs text-gray-600 font-medium" href={`https://${agency.subdomain_name}.duely.app/dashboard`}>{agency.subdomain_name}.duely.app</a>
                  </div>
                </div>
              </td>
              <td className="hidden sm:table-cell px-2 sm:px-4 py-2 border-none">
                <div className="flex items-center space-x-reverse -space-x-3 flex-row-reverse justify-end">
                  <div className="rounded-full h-10 w-10 font-semibold bg-purple-300 text-purple-700 border-2 border-white text-sm grid place-items-center">LW</div>
                  <div className="rounded-full h-10 w-10 font-semibold bg-purple-300 text-purple-700 border-2 border-white text-sm grid place-items-center">LW</div>
                </div>
              </td>
              <td className="hidden sm:table-cell px-2 sm:px-4 py-2 border-none">
                <div className="flex flex-col justify-center px-3">
                  <div className="font-medium">$1,000</div>
                  <div className="text-xs text-gray-600 font-medium">This month</div>
                </div>
              </td>
              <td className="px-2 sm:px-4 py-2 border-none relative">
                <div className="flex flex-col justify-center px-3">
                  <div className="font-medium">Verification</div>
                  <div className="text-xs text-gray-600 font-medium">Stripe</div>
                </div>
                <MultiStatusIndicator className="absolute bottom-0 left-0 pl-4" statuses={account_statuses} />
              </td>
            </tr>
          );
        })}

        <tr className="border-b-2">
          <td className="px-2 sm:px-4 py-4 border-none">
            <div className="flex items-center space-x-3">
              <div className="rounded-full h-12 w-12 sm:h-16 sm:w-16 bg-pink-300 flex"></div>
              <div className="flex flex-col justify-center">
                <div className="font-medium">LWCO Agency</div>
                <div className="text-xs text-gray-600 font-medium">lwco.duely.app</div>
              </div>
            </div>
          </td>
          <td className="hidden sm:table-cell px-2 sm:px-4 py-2 border-none">
            <div className="flex items-center space-x-reverse -space-x-3 flex-row-reverse justify-end">
              <div className="rounded-full h-10 w-10 font-semibold bg-purple-300 text-purple-700 border-2 border-white text-sm grid place-items-center">LW</div>
              <div className="rounded-full h-10 w-10 font-semibold bg-purple-300 text-purple-700 border-2 border-white text-sm grid place-items-center">LW</div>
            </div>
          </td>
          <td className="hidden sm:table-cell px-2 sm:px-4 py-2 border-none">
            <div className="flex flex-col justify-center px-3">
              <div className="font-medium">$1,000</div>
              <div className="text-xs text-gray-600 font-medium">This month</div>
            </div>
          </td>
          <td className="px-2 sm:px-4 py-2 border-none relative">
            <div className="flex flex-col justify-center px-3">
              <div className="font-medium text-gray-500 text-sm">All set up</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
