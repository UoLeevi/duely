import Markdown from 'markdown-to-jsx';
import { useQuery, services_agreement_Q } from '@duely/client';
import { LoadingSpinner } from '@duely/react';

export default function ServicesAgreement({ ok }) {
  const { data, loading, error } = useQuery(services_agreement_Q);

  return (
    <div className="prose-sm prose max-w-screen-xs sm:prose lg:prose-lg">
      {error && error.message}

      {loading && <LoadingSpinner />}

      {data && <Markdown>{data}</Markdown>}

      <div className="flex justify-center">
        <button
          className="px-10 py-2 font-medium leading-5 transition duration-150 ease-in-out bg-gray-100 border border-gray-300 rounded-md shadow-sm text-md focus:outline-none focus:border-blue-300 focus:ring-blue active:bg-gray-50"
          type="button"
          onClick={ok}
        >
          OK
        </button>
      </div>
    </div>
  );
}
