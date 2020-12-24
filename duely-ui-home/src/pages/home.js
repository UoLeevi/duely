import { Link } from 'react-router-dom';
import TopBar from 'components/TopBar';
import useMessage from 'hooks/useMessage';
import { BsExclamationDiamond } from 'react-icons/bs';

export default function Home() {
  useMessage(
    <div className="flex flex-row items-center space-x-4 font-semibold">
      <BsExclamationDiamond className="text-orange-600" />
      <span className="text-sm">Duely is still in development</span>
    </div>
  , { autoHideMs: 6000, show: true });

  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="flex flex-col items-center">
            <div className="mb-2 text-xl font-bold text-gray-400 sm:text-2xl">Duely</div>
            <h3 className="text-4xl font-bold text-center sm:text-6xl md:text-7xl lg:text-8xl">
              <span>Platform for</span><br />
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-green-500">digital agencies</span>
            </h3>
            <Link to="/sign-up">
              <button className="px-5 py-3 mt-6 font-medium leading-5 text-white transition duration-150 ease-in-out bg-indigo-500 border border-gray-300 rounded-md shadow-lg sm:mt-8 md:mt-10 lg:mt-12 hover:bg-indigo-700 text-md focus:outline-none focus:border-blue-300 focus:ring-blue active:bg-gray-50">Request early access</button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
