import { Link } from 'react-router-dom';
import TopBar from 'components/TopBar';
import useMessage from 'hooks/useMessage';
import { BsExclamationDiamond } from 'react-icons/bs';

export default function Home() {
  useMessage(
    <div className="flex flex-row items-center font-semibold space-x-4">
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
            <div className="font-bold text-gray-500 text-xl sm:text-2xl leading-none mb-3">Duely</div>
            <h3 className="font-bold text-4xl sm:text-5xl md:text-6xl text-center leading-tight">
              <span>Platform for</span><br />
              <span className="font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-green-500">digital agencies</span>
            </h3>
            <Link to="/sign-up">
              <button className="mt-6 bg-indigo-500 px-5 py-3 rounded-md text-md font-medium leading-5 text-white transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50">Request early access</button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
