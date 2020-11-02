import Markdown from 'markdown-to-jsx';
import { useQuery, services_agreement_Q } from '@duely/client';
import LoadingSpinner from 'components/LoadingSpinner';

export default function ServicesAgreement({ ok }) {
  const { data, loading, error } = useQuery(services_agreement_Q);

  return (
    <div className="max-w-screen-xs prose prose-sm sm:prose lg:prose-lg">
      {error && error.message}

      {loading && <LoadingSpinner />}

      {data && <Markdown>{data}</Markdown>}
      
      <div className="flex justify-center">
        <button className="bg-gray-100 shadow-sm px-10 py-2 rounded-md text-md font-medium leading-5 transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" type="button" onClick={ok}>OK</button>
      </div>
    </div>
  );
}
