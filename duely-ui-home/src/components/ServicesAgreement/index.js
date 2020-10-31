import { atom, useAtom } from 'jotai';
import { query } from 'apollo';
import Markdown from 'markdown-to-jsx';

const servicesAgreementAtom = atom(query('services_agreement'));

export default function ServicesAgreement({ ok }) {
  const [servicesAgreement] = useAtom(servicesAgreementAtom);

  return (
    <div className="max-w-screen-xs prose prose-sm sm:prose lg:prose-lg">
      <Markdown>{ servicesAgreement }</Markdown>
      <div className="flex justify-center">
        <button className="bg-gray-100 shadow-sm px-10 py-2 rounded-md text-md font-medium leading-5 transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" type="button" onClick={ok}>OK</button>
      </div>
    </div>
  );
}
