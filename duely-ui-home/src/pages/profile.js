import TopBar from 'components/TopBar';
import { Link } from 'react-router-dom';

export default function Profile() {
  return (
    <div className="page-container">
      <TopBar />
      <div className="container box-border h-full px-3 md:px-4 mx-auto flex flex-col flex-1 space-y-6">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="flex flex-col items-center">
            <Link to="/new-brand">
              <button className="mt-6 bg-indigo-500 px-5 py-3 rounded-md text-md font-medium leading-5 text-white transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50">Create your brand</button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
