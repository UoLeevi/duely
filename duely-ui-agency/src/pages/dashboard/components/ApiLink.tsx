import { current_agency_Q } from '@duely/client';
import { useDynamicNavigation, Util } from '@duely/react';

export function ApiLink() {
  const gotoApi = useDynamicNavigation({
    resolveUrl: async () =>
      Util.createGraphQLPlaygroundUrl(current_agency_Q.query, current_agency_Q.variables)
  });

  return (
    <a
      href="https://api.duely.app"
      onClick={gotoApi}
      target="api"
      className="flex items-center space-x-3 text-gray-500 group hover:text-gray-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="text-sm font-medium text-transparent transition-colors group-hover:text-gray-700">
        Try using the API
      </span>
    </a>
  );
}
