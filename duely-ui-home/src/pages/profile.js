import BrandList from 'components/BrandList';
import TopBar from 'components/TopBar';
import { Link } from 'react-router-dom';

export default function Profile() {
  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-col flex-grow flex-shrink-0 pt-8 pb-8 px-2 sm:px-4">
          <div className="flex flex-col space-y-5">
            <div className="flex justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Your brands</h2>
              <Link to="/new-brand">
                <button className="text-sm sm:text-base bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow">+ Create a brand</button>
              </Link>
            </div>
            <BrandList />
          </div>
        </main>
      </div>
    </div>
  );
}
