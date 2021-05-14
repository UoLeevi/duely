import { Link } from 'react-router-dom';
import TopBar from '~/components/TopBar';
import useMessage from '~/hooks/useMessage';

export default function Home() {
  useMessage(
    <div className="flex flex-row items-center space-x-4 font-semibold">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-orange-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span className="text-sm">Duely is still in development</span>
    </div>
  );

  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="flex flex-col items-center">
            <div className="mb-2 text-xl font-bold text-gray-400 sm:text-2xl">Duely</div>
            <h3 className="text-4xl font-bold text-center sm:text-6xl md:text-7xl lg:text-8xl">
              <span>Platform for</span>
              <br />
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-green-500">
                digital agencies
              </span>
            </h3>
            <Link to="/sign-up">
              <button className="px-5 py-3 mt-6 font-medium leading-5 text-white transition duration-150 ease-in-out bg-indigo-500 border border-gray-300 rounded-md shadow-lg sm:mt-8 md:mt-10 lg:mt-12 hover:bg-indigo-700 text-md focus:outline-none focus:border-blue-300 focus:ring-blue active:bg-gray-50">
                Request early access
              </button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
